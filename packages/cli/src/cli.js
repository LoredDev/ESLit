import { Command } from 'commander';
import ConfigsProcessor from './configsProcessor.js';
import configs from './configs.js';
import Workspace from './workspace.js';
import c from 'picocolors';
import path from 'node:path';
import { createSpinner } from 'nanospinner';
import count from './lib/count.js';
import prompts from 'prompts';
import ConfigsFile from './configsFile.js';
import * as cardinal from 'cardinal';
import ansi from 'sisteransi';

const stdout = process.stdout;

export default class Cli {

	#program = new Command();

	/** @type {import('./types').CliArgs} */
	args = {
		dir: process.cwd(),
	};

	/**
	 * @param {import('./types').CliArgs} [args] Cli arguments object
	 */
	constructor(args) {
		this.#program
			.option('--packages <string...>')
			.option('--merge-to-root')
			.option('--dir <path>', undefined)
			.parse();

		this.args = {
			...this.args,
			...this.#program.opts(),
			...args,
		};

		this.args.dir = !this.args.dir.startsWith('/')
			? path.join(process.cwd(), this.args.dir)
			: this.args.dir;

	}

	async run() {

		const spinner = createSpinner('Detecting workspace configuration');

		const processor = new ConfigsProcessor({ configs });
		const workspace = new Workspace(this.args.dir, this.args?.packages);

		let packages = (await workspace.getPackages())
			.map(pkg => {
				spinner.update({ text: `Detecting configuration for package ${c.bold(c.blue(pkg.name))}` });

				pkg.config = processor.detectConfig(pkg);

				return pkg;
			});

		spinner.success({
			text:
				'Detecting workspace configuration ' +
				c.dim(`${count.packagesWithConfigs(packages)} configs founded\n`),
		});

		const merge = this.args.mergeToRoot ?? packages.length > 1 ?
		/** @type {{merge: boolean}} */
				(await prompts({
					name: 'merge',
					message:
					`Would you like to merge all configuration files into one root ${c.blue('eslint.config.js?')}` +
					c.italic(c.dim('\nAll configurations will be applied to the entire workspace and packages')),
					initial: true,
					type: 'confirm',
				})).merge : true;

		console.log(c.dim('\nPlease select which options you prefer\n'));

		packages = await processor.questionConfig(
			merge ? workspace.mergePackages(packages) : packages,
			configs.filter(c => c.manual),
		);

		const fileHandler = new ConfigsFile(configs, packages.find(c => c.root)?.path);

		for (const pkg of packages) {

			pkg.configFile = fileHandler.generateObj(pkg);
			pkg.configFile.content = await fileHandler.generate(pkg.configFile);

			/** @type {boolean} */
			const shouldWrite =
				/** @type {{write: boolean}} */
				(await prompts({
					type: 'confirm',
					name: 'write',
					message: `Do you want to write this config file for ${pkg.root
						? c.blue('the root directory')
						: c.blue(pkg.name)
						}?\n\n${cardinal.highlight(pkg.configFile.content)}`,
					initial: true,
				})).write;

			stdout.write(ansi.erase.lines(pkg.configFile.content.split('\n').length + 2));

			if (shouldWrite) await fileHandler.write(pkg.configFile.path, pkg.configFile.content);

		}

	}

}

