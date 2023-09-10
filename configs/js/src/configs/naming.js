/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
/**
 * @file
 * Configuration objects which enforces a specific naming convention for the codebase.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import { createVariations } from '../lib/rule-variations.js';
import { FILES } from '../constants.js';

const recommended = createVariations({
	files: FILES,
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],
		/*
		 * TODO [>=1.0.0]: This will be replaced by a better naming convention.
		 * 'unicorn/prevent-abbreviations': 'error',
		 */
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
