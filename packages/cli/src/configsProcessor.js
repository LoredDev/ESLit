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
	 * @param {import('./types.js').Package[] | import('./types.js').Package} pkg - The packages to questions the configs
	 * @param {import('./types').Config[]} configs - The configs to be used
	 * @returns {Promise<import('./types.js').Package[]>} - The selected options by the user
	 */
	async questionConfig(pkg, configs) {

		const packages = Array.isArray(pkg) ? [...pkg] : [pkg];

		const instructions = c.dim(`\n${c.bold('A: Toggle all')} - ↑/↓: Highlight option - ←/→/[space]: Toggle selection - enter/return: Complete answer`);

		for (const config of configs) {

			/** @type {import('prompts').Choice[]} */
			const configChoices = config.options.map(option => {return { title: `${str.capitalize(option.name)}`, value: option.name };});

			/** @type {Record<string, string[]>} */
			const selectedOptions = await prompts({
				name: config.name,
				type: config.type === 'multiple' ? 'multiselect' : 'select',
				message: str.capitalize(config.name),
				choices: config.type === 'confirm' ? [
					{
						title: 'Yes',
						value: ['yes'],
					},
					{
						title: 'No',
						value: null,
					},
				] : configChoices,
				hint: config.description,
				instructions: instructions + c.dim(c.italic('\nSelect none if you don\'t want to use this configuration\n')),
			});

			if (selectedOptions[config.name] === null) continue;

			if (selectedOptions[config.name].length === 0) continue;

			if (packages.length <= 1) {
				packages[0].config = new Map([
					...(packages[0].config ?? []),
					...Object.entries(selectedOptions),
				]);
				continue;
			}

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
				type: 'autocompleteMultiselect',
				message: `What packages would you like to apply ${config.type === 'single' ? 'this choice' : 'these choices'}?`,
				choices: packagesOptions,
				min: 1,
				instructions: instructions + c.dim(c.italic('\nToggle all to use in the root configuration\n')),
			});
			selected.packages = selected.packages ?? [];

			selected.packages.map(pkg => {
				pkg.config = new Map([
					...(pkg.config ?? []),
					...Object.entries(selectedOptions),
				]); return pkg;
			});
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
		const pkgConfig = new Map();

		for (const config of this.configs.filter(c => !c.manual)) {
			pkgConfig.set(config.name, this.detectOptions(
				pkg,
				config.options,
				config.type !== 'multiple',
			));
		}

		return pkgConfig;
	}

}

