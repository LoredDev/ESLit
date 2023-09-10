/* eslint-disable import/max-dependencies */
/**
 * @file
 * Main export files for all the configs objects, merging then in one `configs` object.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import typescript from './suggestions-typescript.js';
import environments from './environments/index.js';
import documentation from './documentation.js';
import suggestions from './suggestions.js';
import formatting from './formatting.js';
import overrides from './overrides.js';
import security from './security.js';
import problems from './problems.js';
import naming from './naming.js';
import core from './core.js';

const configs = {
	core,
	documentation,
	environments,
	formatting,
	naming,
	overrides,
	problems,
	security,
	suggestions,
	'suggestions-typescript': typescript,
};
export default configs;
