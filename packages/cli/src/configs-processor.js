import process from 'node:process';
import path from 'node:path';

import prompts from 'prompts';
import glob from 'picomatch';
import c from 'picocolors';

import capitalize from './lib/capitalize.js';

export default class ConfigsProcessor {
	/** @type {import('./types.js').Config[]} */
	configs;

	/** @type {string} */
	dir = process.cwd();

	/**
	 * @param {{
	 * configs: import('./types.js').Config[],
	 * packages?: string[],
	 * directory?: string,
	 * }} options - Cli options.
	 */
	constructor(options) {
		this.configs = options.configs;
		this.dir = path.normalize(options.directory ?? this.dir);
	}

	/**
	 * @param {import('./types.js').Package} pkg - The package to detect configs.
	 * @returns {import('./types.js').Package['config']} - Detected configs record.
	 */
	detectConfig(pkg) {
		/** @type {import('./types.js').Package['config']} */
		const pkgConfig = new Map();

		for (const config of this.configs.filter(cfg => !cfg.manual)) {
			pkgConfig.set(config.name, ConfigsProcessor.detectOptions(
				pkg,
				config.options,
				config.type !== 'multiple',
			));
		}

		return pkgConfig;
	}

	/**
	 * @param {import('./types.js').Package} pkg - Package to detect from.
	 * @param {import('./types.js').Config['options']} options - Options to be passed.
	 * @param {boolean} single - Whether to only detect one option.
	 * @returns {string[]} - The detected options.
	 */
	static detectOptions(pkg, options, single) {
		/** @type {string[]} */
		const detectedOptions = [];

		for (const option of options) {
			if (option.detect === true) {
				detectedOptions.push(option.name);
				// eslint-disable-next-line no-continue
				continue;
			}
			// eslint-disable-next-line no-continue
			else if (!option.detect) { continue; }

			const match = glob(option.detect);

			const files = pkg.files.filter(f => (match ? match(f) : false));
			const directories = pkg.directories.filter(f =>
				(match ? match(f) : false),
			);

			if (files.length > 0 || directories.length > 0) {
				detectedOptions.push(option.name);
				if (single) break;
			}
		}

		return detectedOptions;
	}

	/**
	 * @param {import('./types.js').Package[] | import('./types.js').Package} pkg -
	 * The packages to questions the configs.
	 * @param {import('./types.js').Config[]} configs - The configs to be used.
	 * @returns {Promise<import('./types.js').Package[]>} - The selected options by the user.
	 */
	// eslint-disable-next-line max-statements, complexity, max-lines-per-function
	async questionConfig(pkg, configs) {
		const packages = Array.isArray(pkg) ? [...pkg] : [pkg];

		const instructions = c.dim(`\n${c.bold('A: Toggle all')} - ↑/↓: Highlight option - ←/→/[space]: Toggle selection - enter/return: Complete answer`);

		for (const config of configs) {
			/** @type {import('prompts').Choice[]} */
			const configChoices = config.options.map(option => ({ title: `${capitalize(option.name)}`, value: option.name }));

			/** @type {Record<string, string[]>} */
			// eslint-disable-next-line no-await-in-loop
			const selectedOptions = await prompts({
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
				instructions: instructions + c.dim(c.italic(
					// eslint-disable-next-line max-len
					'\nSelect none if you don\'t want to use this configuration\n',
				)),
				message: capitalize(config.name),
				name: config.name,
				type: config.type === 'multiple' ? 'multiselect' : 'select',
			});

			// eslint-disable-next-line no-continue, @typescript-eslint/no-unnecessary-condition
			if (!selectedOptions[config.name]) continue;

			// eslint-disable-next-line no-continue
			if (selectedOptions[config.name].length === 0) continue;

			if (packages.length <= 1) {
				packages[0].config = new Map([
					...(packages[0].config ?? []),
					...Object.entries(selectedOptions),
				]);
				// eslint-disable-next-line no-continue
				continue;
			}

			/** @type {{title: string, value: import('./types.js').Package}[]} */
			const packagesOptions = packages
				.map(p => (p.root
					? { title: 'root', value: p }
					: {
							title: `${p.name} ${c.dim(p.path.replace(this.dir, '.'))}`,
							value: p,
						}))
				.filter(p => p.title !== 'root');

			/** @type {Record<'packages', import('./types.js').Package[]>} */
			// eslint-disable-next-line no-await-in-loop
			const selected = await prompts({
				choices: packagesOptions,
				instructions: instructions + c.dim(c.italic(
					'\nToggle all to use in the root configuration\n',
				)),
				message: `What packages would you like to apply ${config.type === 'single' ? 'this choice' : 'these choices'}?`,
				min: 1,
				name: 'packages',
				type: 'autocompleteMultiselect',
			});
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			selected.packages ??= [];

			selected.packages.map((p) => {
				p.config = new Map([
					...(p.config ?? []),
					...Object.entries(selectedOptions),
				]); return p;
			});
			packages.map(p =>
				selected.packages.find(s => s.name === p.name) ?? p,
			);
		}

		return packages;
	}
}

