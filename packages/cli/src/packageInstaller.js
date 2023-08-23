import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { exec } from 'node:child_process';
import { createSpinner } from 'nanospinner';
import c from 'picocolors';
import * as recast from 'recast';
import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';


/**
 * @type {import('./types').PackageManagerHandler}
 */
class CommandHandler {

	/** @type {string} */
	command;

	/** @type {((path: string, packages: string[]) => string | Promise<string>) | undefined} */
	checker;

	/**
	 * @param {string} command What command to use to install
	 * @param {(path: string, packages: string[]) => string | Promise<string>} [checker] Checks if a argument should be passed
	 */
	constructor(command, checker) {
		this.command = command;
		this.checker = checker;
	}

	/**
	 * @param {string} path The path to run the command
	 * @param {string[]} packages The packages to be added on the command
	 * @returns {Promise<void>}
	 */
	async install(path, packages) {

		if (this.checker)
			this.command += await this.checker(path, packages);

		return new Promise((res) => {
			const spinner = createSpinner(`Installing packages with ${c.green(this.command)} ${c.dim(packages.join(' '))}`).start();
			try {
				const child = exec(`${this.command} ${packages.join(' ')}`, { cwd: path });
				child.stdout?.on('data', (chunk) => spinner.update({
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					text: `Installing packages with ${c.green(this.command)} ${c.dim(packages.join(' '))}\n  ${c.dim(chunk)}`,
				}));
				child.stdout?.on('close', () => {
					spinner.success({
						text: `Installed packages with ${c.green(this.command)}`,
					}); res();
				});
			}
			catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				res(console.error(`Error while installing the packages with ${this.command} ${c.dim(packages.join(' '))} on ${path}: ${error}`));
			}
		});
	}
}

/**
 * @type {import('./types').PackageManagerHandler}
 */
class DenoHandler {

	/**
	 * @param {string} path The path to run the command
	 * @param {string[]} packages The packages to be added on the command
	 * @returns {Promise<void>}
	 */
	async install(path, packages) {
		const configPath = join(path, 'eslint.config.js');

		if (!existsSync(configPath)) return;

		const configFile = await readFile(configPath, 'utf8');
		/** @type {{program: import('estree').Program}}*/
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { program: ast } = recast.parse(configFile, { parser: (await import('recast/parsers/babel.js')) });

		ast.body.map((node) => {
			if (node.type !== 'ImportDeclaration') return node;

			if (packages.includes(node.source.value?.toString() ?? '')) {
				node.source.value = `npm:${node.source.value}`;
			}
			return node;
		});

		await writeFile(configPath, recast.prettyPrint(ast).code, 'utf-8');

		console.log(c.green('Added npm: specifier to dependencies'));

	}

}

export default class PackageInstaller {

	/**
	 * @typedef {Map<string, string[]>} PackagesMap
	 * @type {PackagesMap}
	 */
	packagesMap;

	/**
	 * @typedef {{
	 *   name: import('./types').PackageManagerName
	 *   description: string
	 * 	 handler: import('./types').PackageManagerHandler
	 * }} PackageManager
	 * @type {PackageManager}
	 */
	packageManager;

	/**
	 * @type {Record<import('./types').PackageManagerName, PackageManager>}
	 */
	packageManagers = {
		deno: {
			name: 'deno',
			description: 'Adds npm: specifiers to the eslint.config.js file',
			handler: new DenoHandler(),
		},
		bun: {
			name: 'bun',
			description: 'Uses bun install',
			handler: new CommandHandler('bun install'),
		},
		pnpm: {
			name: 'pnpm',
			description: 'Uses pnpm install',
			handler: new CommandHandler('pnpm install --save-dev', (path) => {
				if (existsSync(join(path, 'pnpm-workspace.yaml')) && existsSync(join(path, 'package.json')))
					return ' -w';
				else return '';
			}),
		},
		yarn: {
			name: 'yarn',
			description: 'Uses yarn add',
			handler: new CommandHandler('yarn add --dev'),
		},
		npm: {
			name: 'npm',
			description: 'Uses npm install',
			handler: new CommandHandler('npm install --save-dev'),
		},
	};

	/**
	 * @param {PackagesMap} packagesMap The map of directories and packages to be installed
	 * @param {string} root Root directory path
	 */
	constructor(packagesMap, root) {
		this.packagesMap = packagesMap;
		this.packageManager = this.detectPackageManager(root);
	}

	/**
	 * @param {string} root Root directory path
	 * @returns {PackageManager} The package manager detected;
	 * @private
	 */
	detectPackageManager(root) {
		/** @type {(...path: string[]) => boolean} */
		const exists = (...path) => existsSync(join(root, ...path));

		switch (true) {
			case exists('deno.json'):
			case exists('deno.jsonc'):
				return this.packageManagers.deno;

			case exists('bun.lockb'):
				return this.packageManagers.bun;

			case exists('pnpm-lock.yaml'):
				return this.packageManagers.pnpm;

			case exists('yarn.lock'):
				return this.packageManagers.yarn;

			case exists('package-lock.json'):
				return this.packageManagers.npm;

			case exists('package.json'):
				/** @type {{packageManager?: string}} */
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-case-declarations
				const { packageManager } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
				if (!packageManager) return this.packageManagers.npm;

				if (packageManager.includes('pnpm')) return this.packageManagers.pnpm;
				if (packageManager.includes('yarn')) return this.packageManagers.yarn;
				if (packageManager.includes('npm')) return this.packageManagers.npm;

				else return this.packageManagers.npm;

			default: return this.packageManagers.npm;
		}
	}

	async install() {
		for (const [path, packages] of this.packagesMap) {
			await this.packageManager.handler.install(path, packages);
		}
	}

}
