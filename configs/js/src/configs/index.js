
import typescript from './suggestions-typescript.js';
import environments from './environments/index.js';
import suggestions from './suggestions.js';
import formatting from './formatting.js';
import javascript from './javascript.js';
import overrides from './overrides.js';
import naming from './naming.js';
import core from './core.js';

const configs = {
	core,
	environments,
	formatting,
	javascript,
	naming,
	overrides,
	suggestions,
	'suggestions-typescript': typescript,
};
export default configs;
