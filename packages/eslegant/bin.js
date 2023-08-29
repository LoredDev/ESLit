import Cli from '@eslit/cli';

const cli = new Cli({ configs: (await import('./configs.js')).default, dir: process.cwd() });
await cli.run();
