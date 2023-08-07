import path from 'node:path';
import {} from 'recast';
import notNull from './lib/notNull.js';

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
	generateFileObj(pkg) {
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

		console.log(configObj);

		return configObj;
	}

}
