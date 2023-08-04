import { Command } from 'commander';
import ConfigsProcessor from './configsProcessor.js';
import configs from './configs.js';
import Workspace from './workspace.js';
import c from 'picocolors';
import path from 'node:path';
import { createSpinner } from 'nanospinner';
import count from './lib/count.js';

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

		spinner.success({ text:
			'Detecting workspace configuration ' +
			c.dim(`${count.packagesWithConfigs(packages)} configs founded`),
		});

		packages = await processor.questionConfig(packages, configs.filter(c => c.manual));

		const configsMaps = processor.generateConfigMap(packages);

		console.log(configsMaps);

	}

}

