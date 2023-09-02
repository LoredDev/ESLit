/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../constants.js';

/** @type {import('./index.d.ts').ConfigVariations} */
const recommended = createVariations({
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
});

/** @type {import('./index.d.ts').ConfigVariations} */
const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,

		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/explicit-member-accessibility': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
	},
});
const typescript = { recommended, strict };
export default typescript;
