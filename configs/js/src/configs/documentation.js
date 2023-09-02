/* eslint-disable unicorn/no-useless-spread */
// eslint-disable-next-line import/no-relative-parent-imports
import { jsFiles, tsFiles } from '../constants.js';

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // Plugin: eslint-plugin-jsdoc
		'jsdoc/match-description': 'error',
		'jsdoc/require-description-complete-sentence': 'error',
		'jsdoc/require-hyphen-before-param-description': ['error', 'always'],
		'jsdoc/require-param-description': 'error',
		'jsdoc/require-property-description': 'error',
		'jsdoc/require-returns-check': 'error',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,

		...{}, // Plugin: eslint-plugin-jsdoc
		'jsdoc/require-description': 'error',
		'jsdoc/require-file-overview': 'error',
	},
};

const documentation = { recommended, strict };
export default documentation;
