/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
/**
 * @file
 * Configuration objects for preventing possible security vulnerabilities.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import noSecretsPluginRegexes from 'eslint-plugin-no-secrets/regexes.js';
import noSecretsPlugin from 'eslint-plugin-no-secrets';

import { createVariations } from '../lib/rule-variations.js';
import { FILES } from '../constants.js';

const recommended = createVariations({
	files: FILES,
	plugins: {
		'no-secrets': noSecretsPlugin,
	},
	rules: {
		...{}, // Plugin: eslint-plugin-security
		'security/detect-bidi-characters': 'warn',
		'security/detect-disable-mustache-escape': 'warn',
		'security/detect-eval-with-expression': 'warn',
		'security/detect-non-literal-regexp': 'warn',
		'security/detect-object-injection': 'warn',
		'security/detect-possible-timing-attacks': 'warn',
		'security/detect-pseudoRandomBytes': 'warn',
		'security/detect-unsafe-regex': 'warn',

		...{}, // Plugin: eslint-plugin-no-secrets
		'no-secrets/no-secrets': 'warn',
	},
});

const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,

		...{}, // Plugin: eslint-plugin-security
		'security/detect-bidi-characters': 'error',
		'security/detect-disable-mustache-escape': 'error',
		'security/detect-eval-with-expression': 'error',
		'security/detect-non-literal-regexp': 'error',
		'security/detect-object-injection': 'warn',
		'security/detect-possible-timing-attacks': 'warn',
		'security/detect-pseudoRandomBytes': 'error',
		'security/detect-unsafe-regex': 'error',

		...{}, // Plugin: eslint-plugin-no-secrets
		'no-secrets/no-secrets': ['error', {
			additionalRegexes: noSecretsPluginRegexes,
		}],
	},
});

const security = { recommended, strict };
export default security;
