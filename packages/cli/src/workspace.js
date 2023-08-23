import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import YAML from 'yaml';
import path, { join } from 'node:path';
import glob from 'picomatch';
import picomatch from 'picomatch';


/**
 * @template T
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

export default class Workspace {

	/**
	 * @param {string} directory - The directory to get the workspace from
	 * @param {string[] | false} [packagePatterns]
	 * List of package patterns (`false` to explicitly tell that this workspace is not a monorepo)
	 */
	constructor(directory, packagePatterns) {
		this.dir = directory;
		this.packagePatterns = packagePatterns;
	}

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

		return {
			files: files.map(p => path.normalize(p.replace(this.dir, './'))),
			directories: directories.map(p => path.normalize(p.replace(this.dir, './'))),
		};
	}

	/**
	 * @returns {Promise<string[]>} - List of packages on a directory;
	 */
	async getPackagePatterns() {

		/** @type {string[]} */
		let packagePatterns = [];

		const pnpmWorkspace =
			existsSync(join(this.dir, 'pnpm-workspace.yaml'))
				? 'pnpm-workspace.yaml'
				: existsSync(join(this.dir, 'pnpm-workspace.yml'))
					? 'pnpm-workspace.yml'
					: null;

		if (pnpmWorkspace) {
			const pnpmWorkspaceYaml = await fs.readFile(join(this.dir, pnpmWorkspace), 'utf8');

			/** @type {{packages?: string[]}} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const pnpmWorkspaceObj = YAML.parse(pnpmWorkspaceYaml);

			packagePatterns.push(...(pnpmWorkspaceObj?.packages ?? []));
		}
		else if (existsSync(join(this.dir, 'package.json'))) {
			const packageJson = await fs.readFile(join(this.dir, 'package.json'), 'utf8');

			/** @type {{workspaces?: string[]}} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const packageJsonObj = JSON.parse(packageJson);

			packagePatterns.push(...(packageJsonObj?.workspaces ?? []));
		}

		return packagePatterns.map(p => {
			p = path.normalize(p);
			p = p.startsWith('/') ? p.replace('/', '') : p;
			p = p.endsWith('/') ? p.slice(0, p.length - 1) : p;
			return p;
		});
	}

	/**
	 * @returns {Promise<import('./types').Package[]>} - The list of packages that exist in the workspace
	 */
	async getPackages() {

		const paths = await this.getPaths();

		/** @type {import('./types').Package} */
		const rootPackage = {
			root: true,
			name: await getPackageName(this.dir),
			path: this.dir,
			files: paths.files,
			directories: paths.directories,
		};

		if (this.packagePatterns === false) return [rootPackage];

		const packagePatterns = this.packagePatterns ?? await this.getPackagePatterns();
		const packagePaths = paths.directories.filter(d => picomatch.isMatch(d, packagePatterns));

		/** @type {import('./types').Package[]} */
		const packages = [];

		for (const packagePath of packagePaths) {
			packages.push({
				root: false,
				path: join(this.dir, packagePath),
				name: await getPackageName(join(this.dir, packagePath)),
				files: paths.files
					.filter(f => picomatch.isMatch(f, `${packagePath}/**/*`))
					.map(f => f.replace(`${packagePath}/`, '')),
				directories: paths.directories
					.filter(d => picomatch.isMatch(d, `${packagePath}/**/*`))
					.map(d => d.replace(`${packagePath}/`, '')),
			});

			rootPackage.files = rootPackage.files
				.filter(f => picomatch.isMatch(f, `!${packagePath}/**/*`));

			rootPackage.directories = rootPackage.directories
				.filter(d => picomatch.isMatch(d, `!${packagePath}/**/*`));
		}

		return [rootPackage, ...packages];

	}

	/**
	 * @param {import('./types').Package[]} packages - Packages to be merged into root
	 * @returns {[import('./types').Package]} A array containing only the root package
	 */
	mergePackages(packages) {

		const rootPackage = packages.find(p => p.root) ?? packages[0];

		const merged = packages.reduce((accumulated, pkg) => {

			const files = [...new Set([
				...accumulated.files,
				...pkg.files.map(f => join(pkg.path, f)),
			]
				.map(p => p.replace(`${rootPackage.path}/`, '')),
			)];

			const directories = [...new Set([
				...accumulated.directories,
				...pkg.directories.map(d => join(pkg.path, d)),
			]
				.map(p => p.replace(`${rootPackage.path}/`, ''))),
			];

			const mergedConfig = new Map();
			for (const [config, options] of pkg.config ?? []) {
				const accumulatedOptions = accumulated.config?.get(config) ?? [];
				mergedConfig.set(config, [...new Set([...options, ...accumulatedOptions])]);
			}

			return {
				root: true,
				path: rootPackage.path,
				name: rootPackage.name,
				files,
				directories,
				config: mergedConfig,
			};
		}, rootPackage);

		return [merged];

	}

}
