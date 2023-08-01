#!node
import fs from 'node:fs/promises';
import path, { join } from 'node:path';
import { existsSync } from 'node:fs';
import { createSpinner } from 'nanospinner';
import glob from 'picomatch';
import YAML from 'yaml';
import c from 'picocolors';

/**
 * @template T
 *
 * @param {Promise<T>} promise - The async function to try running
 * @returns {Promise<T | null>} - Returns the result of the async function, or null if it errors
 */
async function tryRun(promise) {
	try {
		return await promise;
	}
	catch (err) {
		return null;
	}
}

/**
 * @param {string} directory - The directory to find .gitignore and .eslintignore
 * @returns {Promise<string[]>} - List of ignore glob patterns
 */
async function getIgnoredFiles(directory) {
	const gitIgnore = (await tryRun(fs.readFile(join(directory, '.gitignore'), 'utf8')) ?? '')
		.split('\n')
		.filter(p => p && !p.startsWith('#'))
		.map(p => join(directory, '**', p));

	const eslintIgnore = (await tryRun(fs.readFile(join(directory, '.eslintignore'), 'utf8')) ?? '')
		.split('\n')
		.filter(p => p && !p.startsWith('#'))
		.map(p => join(directory, '**', p));

	return [...eslintIgnore, ...gitIgnore];
}

/**
 * @param {string} directory - The directory to work in.
 * @returns {Promise<string>} - The package name founded.
 */
async function getPackageName(directory) {
	if (existsSync(join(directory, 'package.json'))) {
		const file = await fs.readFile(join(directory, 'package.json'), 'utf8');
		/** @type {{name?: string}} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const obj = JSON.parse(file);

		if (obj.name) return obj.name;
	}
	return path.normalize(directory).split('/').at(-1) ?? directory;
}

/**
 * @param {string} directory - The directory path to work on
 * @param {{files: string[], directories: string[]}} paths - The file list to be filtered
 * @param {string[]} [packages] - The packages to be filtered
 * @returns {Promise<import('./types').Package>} - The package object
 */
async function getRootPackage(directory, paths, packages = []) {

	const ignorePatterns = [
		...packages.map(p =>
			`${join(directory, p, '**/*')}`,
		)];

	console.log(ignorePatterns);

	return {
		name: `${await getPackageName(directory)} [ROOT]`,
		files: paths.files.filter(f =>
			!glob.isMatch(f, ignorePatterns),
		) ?? [],
		directories: paths.directories.filter(d =>
			!glob.isMatch(d, ignorePatterns),
		) ?? [],
		path: directory,
	};
}

export default class Cli {
	/** @type {string} */
	dir = process.cwd();

	/** @type {boolean} */
	debug = false;

	/** @type {import('./types').Config[]} */
	configs;

	/**
	 * @param {{
	 * 	configs: import('./types').Config[]
	 * 	packages?: string[],
	 * 	directory?: string,
	 * 	debug?: boolean,
	 * }} options - Cli options
	 */
	constructor(options) {
		this.configs = options?.configs;
		this.packages = options.packages;
		this.dir = path.normalize(options.directory ?? this.dir);
		this.debug = options.debug ?? this.debug;
	}

	/** @type {{files: string[], directories: string[]} | undefined} */
	#paths;

	/**
	 * @param {string} [directory] - The directory to work on
	 * @param {string[]} [ignores] - Glob patterns to ignore
	 * @returns {Promise<{files: string[], directories: string[]}>} - List of all files in the directory
	 */
	async getPaths(directory = this.dir, ignores = []) {

		ignores.push(
			...[
				'.git',
				'.dist',
				'.DS_Store',
				'node_modules',
			].map((f) => join(directory, f)),
			...await getIgnoredFiles(directory),
		);

		const paths = (await fs.readdir(directory))
			.map((f) => path.normalize(join(directory, f)))
			.filter((p) => !glob.isMatch(p, ignores));

		/** @type {string[]} */
		const files = [];
		/** @type {string[]} */
		const directories = [];

		for (const path of paths) {
			if ((await fs.lstat(path)).isDirectory()) {
				const subPaths = await this.getPaths(path, ignores);
				directories.push(path, ...subPaths.directories);
				files.push(...subPaths.files);
			}
			else {
				files.push(path);
			}
		}

		return { files, directories };
	}

	/** @type {string[] | undefined} */
	packages;

	/**
	 * @returns {Promise<string[]>} - List of packages on a directory;
	 */
	async getPackages() {

		/** @type {string[]} */
		let packages = [];

		const pnpmWorkspace =
			existsSync(join(this.dir, 'pnpm-workspace.yaml'))
				? 'pnpm-workspace.yaml'
				: existsSync(join(this.dir, 'pnpm-workspace.yml'))
					? 'pnpm-workspace.yml'
					: null;

		if (pnpmWorkspace) {
			const fileYaml = await fs.readFile(join(this.dir, pnpmWorkspace), 'utf8');

			/** @type {{packages?: string[]}} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const fileObj = YAML.parse(fileYaml);

			packages.push(...(fileObj?.packages ?? []));
		}
		else if (existsSync(join(this.dir, 'package.json'))) {
			const packageJson = await fs.readFile(join(this.dir, 'package.json'), 'utf8');

			/** @type {{workspaces?: string[]}} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const packageObj = JSON.parse(packageJson);

			packages.push(...(packageObj?.workspaces ?? []));
		}
		return packages;
	}

	/** @type {import('./types').Workspace | undefined} */
	#workspace;

	/**
	 * @returns {Promise<import('./types').Workspace>}
	 * The workspace structure and packages founded
	 */
	async getWorkspace() {
		console.log(this.packages);
		const rootPackage = await getRootPackage(this.dir, this.#paths ?? { files: [], directories: [] }, this.packages);

		/** @type {string[]} */
		const packagesPaths = this.#paths?.directories.filter(d =>
			glob.isMatch(d, this.packages?.map(p => join(this.dir, p)) ?? ''),
		) ?? [];

		/** @type {import('./types').Package[]} */
		const packages = [];

		for (const pkgPath of packagesPaths) {
			packages.push({
				name: await getPackageName(pkgPath),
				files: this.#paths?.files.filter(f => glob.isMatch(f, join(pkgPath, '**/*'))) ?? [],
				directories: this.#paths?.directories.filter(f => glob.isMatch(f, join(pkgPath, '**/*'))) ?? [],
				path: pkgPath,
			});
		}

		return {
			packages: [
				rootPackage,
				...packages,
			],
		};
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

	async run() {

		this.packages ||= await this.getPackages();
		this.#paths = await this.getPaths();
		this.#workspace = await this.getWorkspace();

		this.#workspace.packages = this.#workspace.packages.map(
			pkg => {
				pkg.config = this.detectConfig(pkg); return pkg;
			},
		);

		console.log(JSON.stringify(this.#workspace.packages, null, 2));

	}
}

