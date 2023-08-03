#!node
import path from 'node:path';
import { createSpinner } from 'nanospinner';
import glob from 'picomatch';
import c from 'picocolors';

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
	 * @param {import('nanospinner').Spinner} spinner - Spinner to update
	 * @returns {string[]} - The detected options
	 */
	detectOptions(pkg, options, single, spinner) {

		/** @type {string[]} */
		const detectedOptions = [];

		for (const option of options) {

			spinner.update({
				text: `Configuring ${c.bold(c.blue(pkg.name))}${c.dim(`: option ${c.bold(option.name)}`)}`,
			});

			if (option.detect === true) {
				detectedOptions.push(option.name);
				spinner.update({
					text: `Configuring ${c.bold(c.blue(pkg.name))}${c.dim(`: option ${c.bold(option.name)} ${c.green('✓')}`)}`,
				});
				continue;
			}
			else if (!option.detect) continue;

			const match = glob(option.detect);

			const files = pkg.files.filter(f => match ? match(f) : false);
			const directories = pkg.directories.filter(f => match ? match(f) : false);

			if (files.length > 0 || directories.length > 0) {
				detectedOptions.push(option.name);
				spinner.update({
					text: `Configuring ${c.bold(c.blue(pkg.name))}${c.dim(`: option ${c.bold(option.name)} ${c.green('✔')}`)}`,
				});
				if (single) break;
			}
			else {
				spinner.update({
					text: `Configuring ${c.bold(c.blue(pkg.name))}${c.dim(`: option ${c.bold(option.name)} ${c.red('✖')}`)}`,
				});
			}
		}

		return detectedOptions;
	}

	/**
	 * @param {import('./types.js').Package} pkg - The package to detect configs
	 * @returns {import('./types.js').Package['config']} - Detected configs record
	 */
	detectConfig(pkg) {

		const spinner = createSpinner(`Configuring ${c.bold(c.blue(pkg.name))}`);
		spinner.start();

		/** @type {import('./types.js').Package['config']} */
		const pkgConfig = {};

		for (const config of this.configs) {
			pkgConfig[config.name] = this.detectOptions(
				pkg,
				config.options,
				config.type === 'single',
				spinner,
			);
			spinner.update({ text: `Configuring ${c.bold(c.blue(pkg.name))}${c.dim(`: config ${config.name}`)}` });
		}

		spinner.success({ text: `Configuring ${c.bold(c.blue(pkg.name))}\n${c.dim(JSON.stringify(pkgConfig))}\n` });
		return pkgConfig;
	}

	/**
	 * @param {import('./types.js').Package[]} packages Packages to generate the map from
	 * @returns {import('./types.js').PackagesConfigsMap} A map of what packages has some configuration
	 */
	generateConfigMap(packages) {

		/** @type {import('./types.js').PackagesConfigsMap} */
		const configMap = new Map();

		for (const pkg of packages) {

			Object.entries(pkg.config ?? {}).forEach(([key, options]) => {
				/** @type {Map<string, string[]>} */
				const optionsMap = configMap.get(key) ?? new Map();

				options.forEach(option => {
					const paths = optionsMap.get(option) ?? [];
					optionsMap.set(option, [pkg.path, ...paths]);

					if (paths.length >= packages.length - 2 || paths.includes(this.dir)) {
						console.log('a', packages.length, paths.length);
						optionsMap.set(option, [this.dir]);
					}
				});

				configMap.set(key, optionsMap);
			});
		}

		return configMap;

	}
}

