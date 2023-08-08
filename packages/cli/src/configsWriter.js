import path from 'node:path';
import notNull from './lib/notNull.js';
import * as recast from 'recast';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

/**
 * @param {import('./types').ConfigFile['imports']} map1 - The map to has it values merged from map2
 * @param {import('./types').ConfigFile['imports']} map2 - The map to has it values merged to map1
 * @returns {import('./types').ConfigFile['imports']} The resulting map
 */
function mergeImportsMaps(map1, map2) {
	for (const [key, value] of map2) {
		if (!map1.has(key)) {
			map1.set(key, value);
			continue;
		}
		const imports1 = notNull(map1.get(key));
		const imports2 = notNull(map2.get(key));

		/**
		 * Because arrays and objects are always different independently from having equal values
		 * ([] === [] -> false). It is converted to a string so the comparison can be made.
		 */
		switch ([typeof imports1 === 'string', typeof imports2 === 'string'].join(',')) {
			case 'true,true':
				map1.set(key, imports1);
				break;
			case 'true,false':
				map1.set(key, [['default', imports1.toString()], ...imports2]);
				break;
			case 'false,true':
				map1.set(key, [['default', imports2.toString()], ...imports1]);
				break;
			case 'false,false':
				map1.set(key, [...imports1, ...imports2]);
				break;
		}
		map1.set(key, [...new Set(map1.get(key))]);
	}
	return map1;
}

/**
 * @param {string} path1 The path to traverse from
 * @param {string} root The root path
 * @returns {string} The path to traverse
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
	 * @param {import('./types').Config[]} configs The array of configs to construct from
	 * @param {string} [root] The root directory path
	 */
	constructor(configs, root) {
		this.configs = configs;
		this.root = root ?? this.root;
	}

	/**
	 * @param {import('./types').Package} pkg The package to generate the config string from
	 * @returns {import('./types').ConfigFile} The config file object
	 */
	generateObj(pkg) {
		/** @type {import('./types').ConfigFile} */
		const configObj = {
			path: path.join(pkg.path, 'eslint.config.js'),
			imports: new Map(),
			configs: [],
			presets: [],
			rules: [],
		};

		if (!pkg.root) {
			const rootConfig = path.join(getPathDepth(pkg.path, this.root), 'eslint.config.js');
			configObj.imports.set(!rootConfig.startsWith('.') ? `./${rootConfig}` : rootConfig, 'root');
			configObj.presets.push('root');
		}

		for (const [configName, optionsNames] of notNull(pkg.config)) {

			const config = this.configs.find(c => c.name === configName);
			if (!config) continue;

			const options = config.options.filter(o => optionsNames.includes(o.name));
			if (!options || options.length === 0) continue;

			const imports = options.reduce((acc, opt) => {
				const map1 = new Map(Object.entries(acc.packages ?? {}));
				const map2 = new Map(Object.entries(opt.packages ?? {}));
				acc.packages = Object.fromEntries(mergeImportsMaps(map1, map2));
				return acc;
			});

			configObj.imports = mergeImportsMaps(configObj.imports, new Map(Object.entries(imports.packages ?? {})));

			configObj.configs = [...new Set([
				...configObj.configs,
				...options.map(o => o.configs ?? []).flat(),
			])];

			configObj.rules = [...new Set([
				...configObj.rules,
				...options.map(o => o.rules ?? []).flat(),
			])];

			configObj.presets = [...new Set([
				...configObj.presets,
				...options.map(o => o.presets ?? []).flat(),
			])];

		}

		return configObj;
	}

	/**
	 * ! NOTE:
	 * These functions declared bellow are notably hard to read and have lots of exceptions and
	 * disabled eslint and typescript checks. Unfortunately this is something that I wasn't able to
	 * prevent because a lot of the AST typescript types are somewhat wrong or simply hard to work
	 * with them.
	 *
	 * But for somewhat help developing and prevent unwanted errors in the future, the types and eslint
	 * errors are explicitly disabled and types are explicitly overridden. This is why there are so
	 * many JSDoc type annotations and comments in general.
	 *
	 * Any help to make this code more readable and robust is appreciated
	 */

	/**
	 * @param {import('./types').ConfigFile['configs']} configs The configs objects defined in the config file
	 * @returns {(import('estree').MemberExpression | import('estree').Identifier | import('estree').CallExpression)[]}
	 * The ast expressions nodes to be printed
	 */
	createConfigExpressions(configs) {
		return configs
			.map(c => {
				/** @type {import('estree').MemberExpression | import('estree').Identifier | import('estree').CallExpression} */
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const e = recast.parse(c).program.body[0].expression; return e;
			})
			.filter(e => ['MemberExpression', 'Identifier', 'CallExpression'].includes(e.type));
	}

	/**
	 * @param {import('./types').ConfigFile['presets']} presets The presets objects defined in the config file
	 * @returns {import('estree').SpreadElement[]}
	 * The ast expressions nodes to be printed
	 */
	createPresetExpressions(presets) {
		return presets
			.map(p => {
				/** @type {import('estree').MemberExpression | import('estree').Identifier | import('estree').CallExpression} */
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const e = recast.parse(p).program.body[0].expression; return e;
			})
			.filter(e => ['MemberExpression', 'Identifier', 'CallExpression'].includes(e.type))
			.map(e => {
				/** @type {import('estree').SpreadElement} */
				const spreadElement = {
					type: 'SpreadElement',
					argument: e,
				};
				return spreadElement;
			});
	}

	/**
	 * @param {import('./types').ConfigFile['rules']} rules The rules objects defined in the config file
	 * @returns {import('estree').ObjectExpression}
	 * The ast object expression nodes to be printed
	 */
	createRulesExpression(rules) {
		/** @type {import('estree').ObjectExpression} */
		const rulesObjectExpression = rules
			.map(r => {
				/** @type {import('estree').MemberExpression | import('estree').Identifier | import('estree').CallExpression} */
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const e = recast.parse(r).program.body[0].expression; return e;
			})
			.filter(e => ['MemberExpression', 'Identifier', 'CallExpression'].includes(e.type))
			.map(e => {
				/** @type {import('estree').SpreadElement} */
				const spreadElement = {
					type: 'SpreadElement',
					argument: e,
				};
				return spreadElement;
			}).reduce((acc, spreadElement) => {
				acc.properties.push(spreadElement);
				return acc;
			}, {
				/** @type {import('estree').ObjectExpression['type']} */
				type: 'ObjectExpression',
				/** @type {import('estree').ObjectExpression['properties']} */
				properties: [],
			});
		/** @type {import('estree').ObjectExpression} */
		const rulesExpression = {
			type: 'ObjectExpression',
			properties: [{
				// @ts-expect-error because ObjectProperty doesn't exist in estree types
				type: 'ObjectProperty',
				key: { type: 'Identifier', name: 'rules' },
				value: rulesObjectExpression,
			}],
		};
		return rulesExpression;
	}

	/**
	 * @param {import('./types').ConfigFile} config The config file object to be transformed into a eslint.config.js file
	 * @returns {Promise<void>}
	 */
	async write(config) {

		const existingConfig = existsSync(config.path) ? await fs.readFile(config.path, 'utf-8') : '';

		/** @type {import('estree').ExportDefaultDeclaration}} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		const defaultExportTemplate = recast.parse([
			'/** @type {import(\'eslint\').Linter.FlatConfig[]} */',
			'export default [',
			'',
			'];',
		].join('\n'), {
			parser: (await import('recast/parsers/babel.js')),
		}).program.body.find((/** @type {{ type: string; }} */ n) => n.type === 'ExportDefaultDeclaration');


		/** @type {{program: import('estree').Program}} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { program: ast } = recast.parse(existingConfig, { parser: (await import('recast/parsers/babel.js')) });

		/** @type {import('estree').ExportDefaultDeclaration | undefined} */
		// @ts-expect-error because the types don't match, but are expected to be correct here
		// as the type needs to be ExportDefaultDeclaration
		let defaultExport = ast.body.find(n => n.type === 'ExportDefaultDeclaration');
		if (!defaultExport) {
			defaultExport = defaultExportTemplate;
		}
		else if (defaultExport.declaration.type !== 'ArrayExpression') {
			ast.body.push({
				type: 'VariableDeclaration',
				kind: 'const',
				declarations: [{
					type: 'VariableDeclarator',
					id: { type: 'Identifier', name: 'oldConfig' },
					// @ts-expect-error because defaultExport's declaration is a ArrayExpression
					init: defaultExport.declaration,
				}],
			});
			defaultExport = defaultExportTemplate;
			// @ts-expect-error because defaultExport's declaration is a ArrayExpression
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			defaultExport.declaration.elements.push({
				type: 'SpreadElement',
				argument: { type: 'Identifier', name: 'oldConfig' },
			});
		}

		const elementsExpressions = [];

		if (config.presets.length > 0)
			elementsExpressions.push(...this.createPresetExpressions(config.presets));
		if (config.configs.length > 0)
			elementsExpressions.push(...this.createConfigExpressions(config.configs));
		if (config.rules.length > 0)
			elementsExpressions.push(this.createRulesExpression(config.rules));

		// @ts-expect-error because defaultExport's declaration is a ArrayExpression
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		defaultExport.declaration.elements.push(...elementsExpressions);

		const idx = ast.body.findIndex(n => n.type === 'ExportDefaultDeclaration');
		if (idx > -1) ast.body.splice(idx, 1);
		ast.body.push(defaultExport);

		const finalCode = recast.prettyPrint(ast, { parser: (await import('recast/parsers/babel.js')) }).code;
		console.log(finalCode);

	}

}
