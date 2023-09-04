/**
 * @file
 * Configuration objects which enforces a specific naming convention for the codebase.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../constants.js';

const recommended = createVariations({
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],
		'unicorn/prevent-abbreviations': 'error',
	},
});

const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,
		...{}, // Plugin: @typescript-eslint/eslint-plugin
		// '@typescript-eslint/naming-convention': 'error',

		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/no-keyword-prefix': 'error',

	},
});

const suggestions = { recommended, strict };
export default suggestions;
