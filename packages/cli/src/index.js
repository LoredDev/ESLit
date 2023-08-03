import Cli from './cli.js';
import configs from './configs.js';
import { program } from 'commander';

program.option('--packages <string...>');

program.parse(process.argv);
/** @type {{ packages?: string[] } & import('commander').OptionValues} */
const options = program.opts();

const cli = new Cli({ configs, packages: options.packages });
await cli.run();
