/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../constants.js';

/**
 * This config suggest alternate ways of doing things in JavaScript and TypeScript
 * Recommended alternative, better for projects in prototyping phases.
 * @type {import('./index.d.ts').ConfigVariations}
 */
const recommended = createVariations({
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],
		'unicorn/prevent-abbreviations': 'error',
	},
});

/**
 * This config suggest alternate ways of doing things in JavaScript and TypeScript
 * Strict alternative, better for projects in refactoring and/or production phases.
 * @type {import('./index.d.ts').ConfigVariations}
 */
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
