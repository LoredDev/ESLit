import { jsFiles, tsFiles } from '../constants.js';

/**
 * This config suggest alternate ways of doing things in JavaScript and TypeScript
 * Recommended alternative, better for projects in prototyping phases.
 * @type {import('eslint').Linter.FlatConfig}
 */
const recommended = {
	files: [...tsFiles, ...jsFiles],
	rules: {
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],
		'unicorn/prevent-abbreviations': 'error',
	},
};

/**
 * This config suggest alternate ways of doing things in JavaScript and TypeScript
 * Strict alternative, better for projects in refactoring and/or production phases.
 * @type {import('eslint').Linter.FlatConfig}
 */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,
		'unicorn/no-keyword-prefix': 'error',
	},
};

const suggestions = { recommended, strict };
export default suggestions;
