
import typescript from './suggestions-typescript.js';
import environments from './environments/index.js';
import documentation from './documentation.js';
import suggestions from './suggestions.js';
import formatting from './formatting.js';
import overrides from './overrides.js';
import naming from './naming.js';
import core from './core.js';

const configs = {
	core,
	documentation,
	environments,
	formatting,
	naming,
	overrides,
	suggestions,
	'suggestions-typescript': typescript,
};
export default configs;
