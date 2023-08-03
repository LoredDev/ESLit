#!node
import path, { join } from 'node:path';
import { createSpinner } from 'nanospinner';
import glob from 'picomatch';
import c from 'picocolors';
import Workspace from './workspace.js';

export default class Cli {
	/** @type {string} */
	dir = process.cwd();

	/** @type {boolean} */
	debug = false;

	/** @type {import('./types').Config[]} */
	configs;

	/** @type {import('./types').Workspace | undefined} */
	#workspace;

	/**
	 * @param {{
	 * 	configs: import('./types').Config[]
	 * 	packages?: string[],
	 * 	workspace?: import('./types').Workspace,
	 * 	directory?: string,
	 * 	debug?: boolean,
	 * }} options - Cli options
	 */
	constructor(options) {
		this.configs = options?.configs;
		this.packages = options.packages;
		this.#workspace = options.workspace;
		this.dir = path.normalize(options.directory ?? this.dir);
		this.debug = options.debug ?? this.debug;
	}

	/**
	 * @param {import('./types').Package} pkg - Package to detect from
	 * @param {import('./types').Config['options']} options - Options to be passed
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

			const match = glob(option.detect.map(p => join(pkg.path, p)));

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
	 * @param {import('./types').Package} pkg - The package to detect configs
	 * @returns {import('./types').Package['config']} - Detected configs record
	 */
	detectConfig(pkg) {

		const spinner = createSpinner(`Configuring ${c.bold(c.blue(pkg.name))}`);
		spinner.start();

		/** @type {import('./types').Package['config']} */
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

		spinner.success({ text: `Configuring ${c.bold(c.blue(pkg.name))}` });
		return pkgConfig;
	}

	async run() {
		const workspace = this.#workspace ?? await new Workspace(this.dir).get();

		workspace.packages = workspace.packages.map(
			pkg => {
				pkg.config = this.detectConfig(pkg); return pkg;
			},
		);

		console.log(JSON.stringify(workspace.packages, null, 2));

	}
}

