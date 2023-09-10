import type { CliArgs } from './src/types';

/**
 * Class that handles the creation and running the ESLegant command line interface.
 */
export default class Cli {
	/**
	 * @param args - Arguments to pass to the cli when its runs.
	 */
	public constructor(args: CliArgs);
	/**
	 * Runs the cli with the given arguments.
	 */
	public async run(): Promise<void>;
}

export type { CliArgs, Config } from './src/types.d.ts';
