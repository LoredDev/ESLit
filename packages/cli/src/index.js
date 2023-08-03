import Cli from './cli.js';
import configs from './configs.js';

const cli = new Cli({ configs });
await cli.run();
