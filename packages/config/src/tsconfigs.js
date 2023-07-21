import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, normalize } from 'node:path';

/** @type {(...path: string[]) => string} */
function toPath(...path) {
	return normalize(join(...path));
}

/** @type {(...path: string[]) => boolean} */
function exists(...path) {
	return existsSync(toPath(...path));
}

/**
 * @param {string} directory what the root directory to detect an workspace/monorepo configuration file
 * @returns {Promise<string[]>} list of possible paths of packages' tsconfig.json and jsconfig.json files
 */
async function getMonorepoConfigs(directory) {

	/** @type {string[]} */
	const paths = [];

	if (exists(directory, 'pnpm-workspace.yaml') || exists(directory, 'pnpm-workspace.yml')) {

		const YAML = await import('yaml');

		const yamlFilePath = exists(directory, 'pnpm-workspace.yaml')
			? join(directory, 'pnpm-workspace.yaml')
			: join(directory, 'pnpm-workspace.yml');

		/** @type {{packages?: string[], [properties: string]: unknown}} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const pnpmWorkspaces = YAML.parse(await readFile(yamlFilePath, 'utf-8'));

		const files = pnpmWorkspaces.packages?.map(w => [
			toPath(directory, w, 'tsconfig.json'),
			toPath(directory, w, 'jsconfig.json'),
		]).flat() ?? [];

		paths.push(...files);

	}
	else if (exists(directory, 'package.json')) {
		/** @type {{workspaces?: string[], [properties: string]: unknown}} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const packageJson = JSON.parse(await readFile(join(directory, 'package.json'), 'utf-8'));

		const files = packageJson.workspaces?.map(w => [
			toPath(directory, w, 'tsconfig.json'),
			toPath(directory, w, 'jsconfig.json'),
		]).flat() ?? [];

		paths.push(...files);

	}

	return paths;

}

/**
 * @param {string} directory what the root directory to work on
 * @returns {Promise<string[]>} list of tsconfig.json and jsconfig.json file paths
 */
export async function getTsConfigs(directory) {

	const rootTSConfig = exists(directory, 'tsconfig.eslint.json')
		? toPath(directory, 'tsconfig.eslint.json')
		: exists(directory, 'tsconfig.json')
			? toPath(directory, 'tsconfig.json')
			: undefined;

	const rootJSConfig = exists(directory, 'jsconfig.eslint.json')
		? toPath(directory, 'jsconfig.eslint.json')
		: exists(directory, 'jsconfig.json')
			? toPath(directory, 'jsconfig.json')
			: undefined;

	const monorepoConfigs = await getMonorepoConfigs(directory);

	const paths = /** @type {string[]} */
		([rootTSConfig, rootJSConfig, ...monorepoConfigs]).filter(p => p);

	return paths;

}
