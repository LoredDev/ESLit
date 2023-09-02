/* eslint-disable unicorn/no-useless-spread */

// eslint-disable-next-line import/no-relative-parent-imports
import { tsFiles } from '../constants.js';

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	files: [...tsFiles],
	rules: {
		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/explicit-function-return-type': 'error',

		...{}, // Plugin: eslint-plugin-jsdoc
		'jsdoc/check-tag-names': ['error', { typed: true }],
		'jsdoc/no-types': 'error',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-property-type': 'off',
		'jsdoc/require-returns-type': 'off',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,

		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/explicit-member-accessibility': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
	},
};
const typescript = { recommended, strict };
export default typescript;
