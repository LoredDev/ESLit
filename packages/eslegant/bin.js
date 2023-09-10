#!/usr/bin/env node
import process from 'node:process';

import Cli from '@eslegant/cli';

const cli = new Cli({
	// eslint-disable-next-line unicorn/no-await-expression-member
	configs: (await import('./configs.js')).default,
	dir: process.cwd(),
});
await cli.run();
