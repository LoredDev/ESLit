import { existsSync } from 'node:fs';
import process from 'node:process';
import fs from 'node:fs/promises';
import { join } from 'node:path';

import { parse, prettyPrint } from 'recast';

import astUtils from './lib/ast-utils.js';
import notNull from './lib/not-null.js';

/**
 * @param {import('./types.js').ConfigFile['imports']} map1 -
 * The map to has it values merged from map2.
 * @param {import('./types.js').ConfigFile['imports']} map2 -
 * The map to has it values merged to map1.
 * @returns {import('./types.js').ConfigFile['imports']} The resulting map.
 */
// eslint-disable-next-line max-statements
function mergeImportsMaps(map1, map2) {
	for (const [key, value] of map2) {
		if (!map1.has(key)) {
			map1.set(key, value);
			// eslint-disable-next-line no-continue
			continue;
		}
		const imports1 = notNull(map1.get(key));
		const imports2 = notNull(map2.get(key));

		/**
		 * Because arrays and objects are always different independently from having equal values
		 * ([] === [] -> false). It is converted to a string so the comparison can be made.
		 */
		switch ([
			typeof imports1 === 'string',
			typeof imports2 === 'string',
		].join(',')) {
			case 'true,true': {
				if (imports1.toString() === imports2.toString()) {
					map1.set(key, value);
				}
				else {
					map1.set(key, [
						['default', imports1.toString()],
						['default', imports2.toString()],
					]);
				}
				break;
			}
			case 'true,false': {
				map1.set(key, [['default', imports1.toString()], ...imports2]);
				break;
			}
			case 'false,true': {
				map1.set(key, [['default', imports2.toString()], ...imports1]);
				break;
			}
			case 'false,false': {
				map1.set(key, [...imports1, ...imports2]);
				break;
			}
			default:
				// No nothing
		}
		if (typeof map1.get(key) !== 'string')
			map1.set(key, [...new Set(map1.get(key))]);
	}
	return map1;
}

/**
 * @param {string} path1 - The path to traverse from.
 * @param {string} root - The root path to be removed from the path1.
 * @returns {string} The path to traverse.
 */
function getPathDepth(path1, root) {
	const pathDepth = path1.replace(root, '').split('/').slice(1);
	if (pathDepth.length <= 1) return pathDepth.map(() => '.').join('/');
	return pathDepth.map(() => '..').join('/');
}

export default class ConfigsWriter {
	/** @type {string} */
	root = process.cwd();

	/**
	 * @param {import('./types.js').Config[]} configs - The array of configs to construct from.
	 * @param {string} [root] - The root directory path.
	 */
	constructor(configs, root) {
		this.configs = configs;
		this.root = root ?? this.root;
	}

	/**
	 * @param {Program} ast - The program ast to be manipulated.
	 * @returns {Promise<Program>} The final ast with the recreated default export.
	 * @private
	 */
	static async addDefaultExport(ast) {
		/** @type {{program: Program}} */
		// eslint-disable-next-line max-len
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		const { program: exportTemplateAst } = parse([
			'/** @type {import(\'eslint\').Linter.FlatConfig[]} */',
			'export default [',
			'',
			'];',
		].join('\n'), { parser: (await import('recast/parsers/babel.js')) });
		/** @type {import('estree').ExportDefaultDeclaration} */
		// @ts-expect-error Node type needs to be ExportDefaultDeclaration to be founded
		const exportTemplateNode = exportTemplateAst.body
			.find(n => n.type === 'ExportDefaultDeclaration');

		/** @type {import('estree').ExportDefaultDeclaration | undefined} */
		// @ts-expect-error Node type needs to be ExportDefaultDeclaration to be founded
		const astExport = ast.body
			.find(n => n.type === 'ExportDefaultDeclaration');

		if (!astExport) { ast.body.push(exportTemplateNode); return ast; }

		/** @type {import('estree').VariableDeclaration | undefined} */
		const oldExportValue = astExport.declaration.type === 'ArrayExpression'
			? undefined
			: astUtils.createVariable(
				'oldConfig',
				// @ts-expect-error astExport.declaration is a expression
				astExport.declaration,
				'const',
			);

		if (!oldExportValue) return ast;

		// @ts-expect-error declaration is a ArrayExpression
		// eslint-disable-next-line max-len
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		exportTemplateNode.declaration.elements.push({
			argument: { name: 'oldConfig', type: 'Identifier' },
			type: 'SpreadElement',
		});

		const astExportIdx = ast.body.indexOf(astExport);
		// eslint-disable-next-line security/detect-object-injection
		ast.body[astExportIdx] = exportTemplateNode;
		ast.body.splice(astExportIdx - 1, 0, oldExportValue);

		return ast;
	}

	/**
	 * ! NOTE:
	 * These functions declared bellow are notably hard to read and have lots of exceptions and
	 * disabled eslint and typescript checks. Unfortunately this is something that I wasn't able to
	 * prevent because a lot of the AST typescript types are somewhat wrong or simply hard to work
	 * with them.
	 *
	 * But for somewhat help developing and prevent unwanted errors in the future, the types and
	 * eslint errors are explicitly disabled and types are explicitly overridden. This is why
	 * there are so many JSDoc type annotations and comments in general.
	 *
	 * Any help to make this code more readable and robust is appreciated.
	 */

	/**
	 * @typedef {import('estree').Program} Program
	 * @typedef {(
	 * import('./lib/ast-utils.js').ExpressionOrIdentifier |
	 * import('estree').ObjectExpression |
	 * import('estree').SpreadElement
	 * )} ConfigArrayElement
	 */

	/**
	 * Adds elements to the default export node, without adding duplicates.
	 * @typedef {import('estree').ArrayExpression} ArrayExpression
	 * @param {Program} ast - The program ast to be manipulated.
	 * @param {ConfigArrayElement[]} elements - The elements to be added to the array.
	 * @returns {Program} The final ast with the recreated default export.
	 * @private
	 */
	static addElementsToExport(ast, elements) {
		/** @type {import('estree').ExportDefaultDeclaration} */
		// @ts-expect-error Node type needs to be ExportDefaultDeclaration to be founded
		const exportNode = ast.body.find(n =>
			n.type === 'ExportDefaultDeclaration',
		);
		const exportNodeIdx = ast.body.indexOf(exportNode);

		/** @type {ArrayExpression} */
		// @ts-expect-error declaration is a ArrayExpression
		const array = exportNode.declaration;

		for (const e of elements) {
			if (!(
				e.type !== 'ObjectExpression' &&
				astUtils.findInArray(array, e)
			))
				array.elements.push(e);
		}

		exportNode.declaration = array;
		// eslint-disable-next-line security/detect-object-injection
		ast.body[exportNodeIdx] = exportNode;

		return ast;
	}

	/**
	 * @param {Program} ast - The program ast to be manipulated.
	 * @param {import('./types.js').ConfigFile['imports']} imports - The imports map to be used.
	 * @returns {Program} The final ast with the recreated default export.
	 */
	static addPackageImports(ast, imports) {
		/** @type {import('estree').ImportDeclaration[]} */
		const importDeclarations = [];

		for (const [pkgName, specifiers] of imports) {
			/** @type {import('estree').ImportDeclaration | undefined} */
			// @ts-expect-error type error, the specifier has to be ImportDeclaration to be founded
			const existingDeclaration = ast.body.find(s =>
				s.type === 'ImportDeclaration' &&
				s.source.value === pkgName,
			);

			const importDeclaration = astUtils.createImportDeclaration(
				pkgName,
				typeof specifiers === 'string'
					? specifiers
					: undefined,
				existingDeclaration,
			);

			if (typeof specifiers !== 'string') {
				for (const s of specifiers) {
					if (typeof s === 'string')
						importDeclaration.addSpecifier(s);
					else
						importDeclaration.addSpecifier(s[0], s[1]);
				}
			}

			if (existingDeclaration) {
				ast.body[ast.body.indexOf(existingDeclaration)] =
					importDeclaration.body;
			}
			else {
				importDeclarations.push(importDeclaration.body);
			}
		}

		ast.body.unshift(...importDeclarations);

		return ast;
	}

	/**
	 * @param {import('./types.js').ConfigFile['rules']} rules -
	 * The rules to be used to create the object.
	 * @returns {import('estree').ObjectExpression} The object containing the spread rules.
	 * @private
	 */
	static createRulesObject(rules) {
		/** @type {import('estree').SpreadElement[]} */
		// @ts-expect-error The array is filtered to remove undefined's
		const expressions = rules
			.map((r) => {
				const e = astUtils.stringToExpression(r);
				return e ? astUtils.toSpreadElement(e) : undefined;
			}).filter(Boolean);

		return {
			properties: [{
				key: { name: 'rules', type: 'Identifier' },
				// @ts-expect-error because ObjectProperty doesn't exist in estree types
				type: 'ObjectProperty',
				value: {
					properties: expressions,
					type: 'ObjectExpression',
				},
			}],
			type: 'ObjectExpression',
		};
	}

	/**
	 * @param {import('./types.js').ConfigFile} config -
	 * The config file object to be transformed into a eslint.config.js file.
	 * @returns {Promise<string>} The generated config file contents.
	 */
	static async generate(config) {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const existingConfig = existsSync(config.path)
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			? await fs.readFile(config.path, 'utf8')
			: '';

		/** @type {{program: Program}} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { program: ast } = parse(
			existingConfig,
			{ parser: (await import('recast/parsers/babel.js')) },
		);

		await ConfigsWriter.addDefaultExport(ast);

		/**
		 * @type {ConfigArrayElement[]}
		 */
		// @ts-expect-error The array is filtered to remove undefined's
		const elements = [
			...config.configs.map(c => astUtils.stringToExpression(c)),
			...config.presets.map((p) => {
				const e = astUtils.stringToExpression(p);
				return e ? astUtils.toSpreadElement(e) : undefined;
			}),
			config.rules.length > 0
				? ConfigsWriter.createRulesObject(config.rules)
				: undefined,
		].filter(Boolean);

		ConfigsWriter.addElementsToExport(ast, elements);
		ConfigsWriter.addPackageImports(ast, config.imports);

		const finalCode = prettyPrint(
			ast,
			{ parser: (await import('recast/parsers/babel.js')) },
		).code;
		return finalCode;
	}


	/**
	 * @param {import('./types.js').Package} pkg - The package to generate the config string from.
	 * @returns {import('./types.js').ConfigFile} The config file object.
	 */
	// eslint-disable-next-line max-statements
	generateObj(pkg) {
		/** @type {import('./types.js').ConfigFile} */
		const configObj = {
			configs: [],
			imports: new Map(),
			path: join(pkg.path, 'eslint.config.js'),
			presets: [],
			rules: [],
		};

		if (!pkg.root) {
			const rootConfig = join(
				getPathDepth(pkg.path, this.root),
				'eslint.config.js',
			);
			configObj.imports.set(rootConfig.startsWith('.') ? rootConfig : `./${rootConfig}`, 'root');
			configObj.presets.push('root');
		}

		for (const [configName, optionsNames] of notNull(pkg.config)) {
			const config = this.configs.find(c => c.name === configName);
			// eslint-disable-next-line no-continue
			if (!config) continue;

			const options = config.options.filter(o =>
				optionsNames.includes(o.name),
			);
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-continue
			if (!options || options.length === 0) continue;

			// eslint-disable-next-line unicorn/no-array-reduce
			const imports = options.reduce((acc, opt) => {
				const map1 = new Map(Object.entries(acc.packages ?? {}));
				const map2 = new Map(Object.entries(opt.packages ?? {}));
				acc.packages = Object.fromEntries(mergeImportsMaps(map1, map2));
				return acc;
			});

			configObj.imports = mergeImportsMaps(
				configObj.imports,
				new Map(Object.entries(imports.packages ?? {})),
			);

			configObj.configs = [...new Set([
				...configObj.configs,
				...options.flatMap(o => o.configs ?? []),
			])];

			configObj.rules = [...new Set([
				...configObj.rules,
				...options.flatMap(o => o.rules ?? []),
			])];

			configObj.presets = [...new Set([
				...configObj.presets,
				...options.flatMap(o => o.presets ?? []),
			])];
		}

		return configObj;
	}

	/**
	 * @param {string} path - The path to the file to be written.
	 * @param {string} content - The content of the file.
	 * @returns {Promise<void>}
	 */
	static async write(path, content) {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		await fs.writeFile(path, content, 'utf8');
	}
}
