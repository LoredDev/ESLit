/* eslint-disable security/detect-non-literal-fs-filename */
import path, { join } from 'node:path';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';

import picomatch from 'picomatch';
import YAML from 'yaml';


/**
 * @template T
 * @param {Promise<T>} promise - The async function to try running.
 * @returns {Promise<T | null>} - Returns the result of the async function, or null if it errors.
 */
async function tryRun(promise) {
	try {
		return await promise;
	}
	catch {
		return null;
	}
}

/**
 * @param {string} directory - The directory to find .gitignore and .eslintignore.
 * @returns {Promise<string[]>} - List of ignore glob patterns.
 */
async function getIgnoredFiles(directory) {
	const gitIgnore = (
		await tryRun(fs.readFile(join(directory, '.gitignore'), 'utf8')) ??
		'')
		.split('\n')
		.filter(p => p && !p.startsWith('#'))
		.map(p => join(directory, '**', p));

	const eslintIgnore = (
		await tryRun(fs.readFile(join(directory, '.eslintignore'), 'utf8')) ??
		'')
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
		const object = JSON.parse(file);

		if (object.name) return object.name;
	}
	return path.normalize(directory).split('/').at(-1) ?? directory;
}

export default class Workspace {
	/**
	 * @param {string} directory -
	 * The directory to get the workspace from.
	 * @param {string[] | false} [packagePatterns] -
	 * List of package patterns (`false` to explicitly tell that this workspace is not a monorepo).
	 */
	constructor(directory, packagePatterns) {
		this.dir = directory;
		this.packagePatterns = packagePatterns;
	}

	/**
	 * @returns {Promise<string[]>} - List of packages on a directory;.
	 */
	async getPackagePatterns() {
		/** @type {string[]} */
		const packagePatterns = [];

		const pnpmWorkspace =
			existsSync(join(this.dir, 'pnpm-workspace.yaml'))
				? 'pnpm-workspace.yaml'
				: (existsSync(join(this.dir, 'pnpm-workspace.yml'))
						? 'pnpm-workspace.yml'
						: null);

		if (pnpmWorkspace) {
			const pnpmWorkspaceYaml = await fs.readFile(
				join(this.dir, pnpmWorkspace),
				'utf8',
			);

			/** @type {{packages?: string[]}} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const pnpmWorkspaceObject = YAML.parse(pnpmWorkspaceYaml);

			packagePatterns.push(...pnpmWorkspaceObject.packages ?? []);
		}
		else if (existsSync(join(this.dir, 'package.json'))) {
			const packageJson = await fs.readFile(
				join(this.dir, 'package.json'),
				'utf8',
			);

			/** @type {{workspaces?: string[]}} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const packageJsonObject = JSON.parse(packageJson);

			packagePatterns.push(...packageJsonObject.workspaces ?? []);
		}

		return packagePatterns.map((p) => {
			p = path.normalize(p);
			p = p.startsWith('/') ? p.replace('/', '') : p;
			p = p.endsWith('/') ? p.slice(0, -1) : p;
			return p;
		});
	}

	/**
	 * @returns {Promise<import('./types').Package[]>} -
	 * The list of packages that exist in the workspace.
	 */
	async getPackages() {
		const paths = await this.getPaths();

		/** @type {import('./types').Package} */
		const rootPackage = {
			directories: paths.directories,
			files: paths.files,
			name: await getPackageName(this.dir),
			path: this.dir,
			root: true,
		};

		if (this.packagePatterns === false) return [rootPackage];

		const packagePatterns =
			this.packagePatterns ??
			await this.getPackagePatterns();

		const packagePaths = paths.directories.filter(d =>
			picomatch.isMatch(d, packagePatterns),
		);

		/** @type {import('./types').Package[]} */
		const packages = [];

		for (const packagePath of packagePaths) {
			packages.push({
				directories: paths.directories
					.filter(d => picomatch.isMatch(d, `${packagePath}/**/*`))
					.map(d => d.replace(`${packagePath}/`, '')),
				files: paths.files
					.filter(f => picomatch.isMatch(f, `${packagePath}/**/*`))
					.map(f => f.replace(`${packagePath}/`, '')),
				// eslint-disable-next-line no-await-in-loop
				name: await getPackageName(join(this.dir, packagePath)),
				path: join(this.dir, packagePath),
				root: false,
			});

			rootPackage.files = rootPackage.files
				.filter(f => picomatch.isMatch(f, `!${packagePath}/**/*`));

			rootPackage.directories = rootPackage.directories
				.filter(d => picomatch.isMatch(d, `!${packagePath}/**/*`));
		}

		return [rootPackage, ...packages];
	}

	/**
	 * @param {string} [directory] - The directory to work on.
	 * @param {string[]} [ignores] - Glob patterns to ignore.
	 * @returns {Promise<{files: string[], directories: string[]}>} -
	 * List of all files in the directory.
	 */
	async getPaths(directory = this.dir, ignores = []) {
		ignores.push(
			...[
				'.git',
				'.dist',
				'.DS_Store',
				'node_modules',
			].map(f => join(directory, f)),
			...await getIgnoredFiles(directory),
		);

		const pathsUnfiltered = await fs.readdir(directory);
		const paths = pathsUnfiltered
			.map(f => path.normalize(join(directory, f)))
			.filter(p => !picomatch.isMatch(p, ignores));

		/** @type {string[]} */
		const files = [];
		/** @type {string[]} */
		const directories = [];

		for (const p of paths) {
			// eslint-disable-next-line no-await-in-loop, unicorn/no-await-expression-member
			if ((await fs.lstat(p)).isDirectory()) {
				// eslint-disable-next-line no-await-in-loop
				const subPaths = await this.getPaths(p, ignores);
				directories.push(p, ...subPaths.directories);
				files.push(...subPaths.files);
			}
			else {
				files.push(p);
			}
		}

		return {
			directories: directories.map(p =>
				path.normalize(p.replace(this.dir, './')),
			),
			files: files.map(p => path.normalize(p.replace(this.dir, './'))),
		};
	}

	/**
	 * @param {import('./types').Package[]} packages - Packages to be merged into root.
	 * @returns {[import('./types').Package]} A array containing only the root package.
	 */
	static mergePackages(packages) {
		const rootPackage = packages.find(p => p.root) ?? packages[0];

		// TODO [>=1.0.0]: Refactor this to remove the use of Array#reduce()
		// eslint-disable-next-line unicorn/no-array-reduce
		const merged = packages.reduce((accumulated, package_) => {
			const files = [...new Set([
				...accumulated.files,
				...package_.files.map(f => join(package_.path, f)),
			]
				.map(p => p.replace(`${rootPackage.path}/`, '')),
			)];

			const directories = [...new Set([
				...accumulated.directories,
				...package_.directories.map(d => join(package_.path, d)),
			]
				.map(p => p.replace(`${rootPackage.path}/`, ''))),
			];

			const mergedConfig = new Map();
			for (const [config, options] of package_.config ?? []) {
				const accumulatedOptions =
					accumulated.config?.get(config) ??
					[];
				mergedConfig.set(
					config,
					[...new Set([...options, ...accumulatedOptions])],
				);
			}

			return {
				config: mergedConfig,
				directories,
				files,
				name: rootPackage.name,
				path: rootPackage.path,
				root: true,
			};
		}, rootPackage);

		return [merged];
	}
}
