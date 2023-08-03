import { Command } from 'commander';
import ConfigsProcessor from './configsProcessor.js';
import configs from './configs.js';
import Workspace from './workspace.js';
import path from 'node:path';

export default class Cli {

	#program = new Command();

	/** @type {import('./types').CliArgs} */
	args = {
		dir: process.cwd(),
	};

	setArgs() {
		this.#program
			.option('--packages <string...>')
			.option('--merge-to-root')
			.option('--dir <path>', undefined);

		this.#program.parse();

		this.args = {
			...this.args,
			...this.#program.opts(),
		};

		this.args.dir = !this.args.dir.startsWith('/')
			? path.join(process.cwd(), this.args.dir)
			: this.args.dir;

	}

	async run() {
		this.setArgs();

		console.log(this.args.dir);

		const processor = new ConfigsProcessor({ configs });
		const packages = (await new Workspace(this.args.dir, this.args?.packages )
			.getPackages())
			.map(pkg => {
				pkg.config = processor.detectConfig(pkg);
				return pkg;
			});

		const configsMaps = processor.generateConfigMap(packages);

		console.log(configsMaps);

	}

}

