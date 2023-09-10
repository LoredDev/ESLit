/* eslint-disable no-console */
/* eslint-disable import/max-dependencies */
import process from 'node:process';
import path from 'node:path';

import { createSpinner } from 'nanospinner';
import { Command } from 'commander';
import { erase } from 'sisteransi';
import cardinal from 'cardinal';
import prompts from 'prompts';
import c from 'picocolors';

import PackageInstaller from './package-installer.js';
import ConfigsProcessor from './configs-processor.js';
import ConfigsFile from './configs-file.js';
import notNull from './lib/not-null.js';
import Workspace from './workspace.js';
import count from './lib/count.js';

const stdout = process.stdout;

export default class Cli {
	#program = new Command();

	/** @type {import('./types').CliArgs} */
	args = {
		configs: [],
		dir: process.cwd(),
	};

	/**
	 * @param {import('./types').CliArgs} [args] - Cli arguments object.
	 */
	constructor(args) {
		this.#program
			.argument('[url-to-config]')
			.option('--packages <string...>')
			.option('--dir <path>', undefined)
			.option('--merge-to-root')
			.option('--install-pkgs')
			.parse();

		this.args = {
			...this.args,
			...this.#program.opts(),
			...args,
		};

		this.args.dir = this.args.dir.startsWith('/')
			? this.args.dir
			: path.join(process.cwd(), this.args.dir);
	}

	// eslint-disable-next-line max-lines-per-function, max-statements, complexity
	async run() {
		process.chdir(this.args.dir);

		const configs = this.args.configs;
		const spinner = createSpinner('Detecting workspace configuration');

		const processor = new ConfigsProcessor({ configs });
		const workspace = new Workspace(this.args.dir, this.args.packages);

		let packages = await workspace.getPackages();
		packages = packages.map((pkg) => {
			spinner.update({
				text: `Detecting configuration for package ${c.bold(c.blue(pkg.name))}`,
			});

			pkg.config = processor.detectConfig(pkg);

			return pkg;
		});

		spinner.success({
			text:
				`Detecting workspace configuration ${
				c.dim(`${count.packagesWithConfigs(packages)} configs founded\n`)}`,
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const merge = this.args.mergeToRoot ?? (packages.length > 1
		/** @type {{merge: boolean}} */
			? (await prompts({
					initial: true,
					message:
					`Would you like to merge all configuration files into one root ${c.blue('eslint.config.js?')}${
					c.italic(c.dim('\nAll configurations will be applied to the entire workspace and packages'))}`,
					name: 'merge',
					type: 'confirm',
				// eslint-disable-next-line unicorn/no-await-expression-member
				})).merge : true);

		console.log(c.dim('\nPlease select which options you prefer\n'));

		packages = await processor.questionConfig(
			merge ? Workspace.mergePackages(packages) : packages,
			configs.filter(config => config.manual),
		);

		const fileHandler = new ConfigsFile(
			configs,
			packages.find(config => config.root)?.path,
		);

		for (const pkg of packages) {
			pkg.configFile = fileHandler.generateObj(pkg);
			// eslint-disable-next-line no-await-in-loop
			pkg.configFile.content = await ConfigsFile.generate(pkg.configFile);

			/** @type {boolean} */
			const shouldWrite =
				/** @type {{write: boolean}} */
				// eslint-disable-next-line no-await-in-loop
				(await prompts({
					initial: true,
					message: `Do you want to write this config file for ${pkg.root
						? c.blue('the root directory')
						: c.blue(pkg.name)
						}?\n\n${cardinal.highlight(pkg.configFile.content)}`,
					name: 'write',
					type: 'confirm',
				// eslint-disable-next-line unicorn/no-await-expression-member
				})).write;

			stdout.write(
				erase.lines(pkg.configFile.content.split('\n').length + 2),
			);

			if (shouldWrite) {
				// eslint-disable-next-line no-await-in-loop
				await ConfigsFile.write(
					pkg.configFile.path,
					pkg.configFile.content,
				);
			}
		}

		const packagesMap = new Map(packages.map(p =>
			[p.path, [...notNull(p.configFile).imports.keys()]],
		));
		const installer = new PackageInstaller(
			packagesMap,
			packages.find(p => p.root === true)?.path ?? this.args.dir,
		);

		/** @type {boolean | 'changePackage'} */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		let installPkgs = this.args.installPkgs ?? (await prompts({
			choices: [
				{
					description: installer.packageManager.description,
					title: 'Yes, install all packages',
					value: true,
				},
				{ title: 'No, I will install them manually', value: false },
				{ title: 'Change package manager', value: 'changePackage' },
			],
			message:
					`Would you like to ESLit to install the npm packages with ${c.green(installer.packageManager.name)}?\n${c.reset(c.dim(`  Packages to install: ${[...new Set(packagesMap.values())].join(' ')}\n`))}`,
			name: 'install',
			type: 'select',
		// eslint-disable-next-line unicorn/no-await-expression-member
		})).install;

		if (installPkgs === 'changePackage') {
			/** @type {{manager: import('./types').PackageManagerName}} */
			const prompt = await prompts({
				choices: Object.values(installer.packageManagers).map(m => ({
					description: m.description,
					title: m.name,
					value: m.name,
				})),
				message: 'What package manager do you want ESLit to use?',
				name: 'manager',
				type: 'select',
			});
			installer.packageManager =
				installer.packageManagers[prompt.manager];

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!installer.packageManager)
				// eslint-disable-next-line max-len
				// eslint-disable-next-line @typescript-eslint/no-throw-literal, @typescript-eslint/no-confusing-void-expression
				throw console.log(c.red('You must select a package manager'));

			installPkgs = true;
		}

		if (installPkgs) await installer.install();
	}
}

