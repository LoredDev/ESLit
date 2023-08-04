#!node
import path from 'node:path';
import glob from 'picomatch';
import prompts from 'prompts';
import c from 'picocolors';
import str from './lib/str.js';

export default class ConfigsProcessor {
	/** @type {string} */
	dir = process.cwd();

	/** @type {import('./types.js').Config[]} */
	configs;

	/** @type {string[] | undefined} */
	#packagesPatterns;

	/**
	 * @param {{
	 * 	configs: import('./types.js').Config[],
	 * 	packages?: string[],
	 * 	directory?: string,
	 * }} options - Cli options
	 */
	constructor(options) {
		this.#packagesPatterns = options.packages;
		this.configs = options?.configs;
		this.dir = path.normalize(options.directory ?? this.dir);
	}

	/**
	 * @param {import('./types.js').Package} pkg - Package to detect from
	 * @param {import('./types.js').Config['options']} options - Options to be passed
	 * @param {boolean} single - Whether to only detect one option
	 * @returns {string[]} - The detected options
	 */
	detectOptions(pkg, options, single) {

		/** @type {string[]} */
		const detectedOptions = [];

		for (const option of options) {

			if (option.detect === true) {
				detectedOptions.push(option.name);
				continue;
			}
			else if (!option.detect) continue;

			const match = glob(option.detect);

			const files = pkg.files.filter(f => match ? match(f) : false);
			const directories = pkg.directories.filter(f => match ? match(f) : false);

			if (files.length > 0 || directories.length > 0) {
				detectedOptions.push(option.name);
				if (single) break;
			}
		}

		return detectedOptions;
	}

	/**
	 * @param {import('./types.js').Package[]} packages - The package to detect configs
	 * @returns {Promise<import('./types.js').Package[]>} - The selected options by the user
	 */
	async questionConfigs(packages) {

		const instructions = c.dim(`\n${c.bold('A: Toggle all')} - ↑/↓: Highlight option - ←/→/[space]: Toggle selection - enter/return: Complete answer`);

		for (const config of this.configs.filter(c => c.manual)) {

			/** @type {import('prompts').Choice[]} */
			const configChoices = config.options.map(option => {return { title: `${str.capitalize(option.name)}`, value: option.name };});

			/** @type {Record<string, string[]>} */
			const selectedOptions = await prompts({
				name: config.name,
				type: config.type === 'single' ? 'select' : 'multiselect',
				message: str.capitalize(config.name),
				choices: configChoices,
				hint: config.description,
				instructions: instructions + c.dim(c.italic('\nSelect none if you don\'t want to use this configuration\n')),
			});

			if (selectedOptions[config.name].length === 0) continue;

			/** @type {{title: string, value: import('./types').Package}[]} */
			const packagesOptions = packages
				.map(pkg => {
					return !pkg.root
						? {
								title: `${pkg.name} ${c.dim(pkg.path.replace(this.dir, '.'))}`,
								value: pkg,
							}
						: { title: 'root', value: pkg };
				})
				.filter(p => p.title !== 'root');

			/** @type {Record<'packages', import('./types').Package[]>} */
			const selected = await prompts({
				name: 'packages',
				type: 'multiselect',
				message: `What packages would you like to apply ${config.type === 'single' ? 'this choice' : 'these choices'}?`,
				choices: packagesOptions,
				min: 1,
				instructions: instructions + c.dim(c.italic('\nToggle all to use in the root configuration\n')),
			});
			selected.packages = selected.packages ?? [];

			selected.packages.map(pkg => { pkg.config = { ...pkg.config, ...selectedOptions }; return pkg; });
			packages.map(pkg => selected.packages.find(s => s.name === pkg.name) ?? pkg);
		}

		return packages;

	}

	/**
	 * @param {import('./types').Package} pkg - The package to detect configs
	 * @returns {import('./types').Package['config']} - Detected configs record
	 */
	detectConfig(pkg) {

		/** @type {import('./types.js').Package['config']} */
		const pkgConfig = {};

		for (const config of this.configs.filter(c => !c.manual)) {
			pkgConfig[config.name] = this.detectOptions(
				pkg,
				config.options,
				config.type === 'single',
			);
		}

		return pkgConfig;
	}

	/**
	 * @param {import('./types').Package[]} packages Packages to generate the map from
	 * @returns {import('./types').PackagesConfigsMap} A map of what packages has some configuration
	 */
	generateConfigMap(packages) {

		/** @type {import('./types').PackagesConfigsMap} */
		const configMap = new Map();

		for (const pkg of packages) {

			Object.entries(pkg.config ?? {}).forEach(([key, options]) => {
				/** @type {Map<string, string[]>} */
				const optionsMap = configMap.get(key) ?? new Map();

				options.forEach(option => {
					const paths = optionsMap.get(option) ?? [];
					optionsMap.set(option, [pkg.path, ...paths]);

					if (paths.length >= packages.length - 2 || paths.includes(this.dir)) {
						optionsMap.set(option, [this.dir]);
					}
				});

				configMap.set(key, optionsMap);
			});
		}

		return configMap;

	}
}

