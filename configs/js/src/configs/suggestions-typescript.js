/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
/**
 * @file
 * Configuration objects that enforces different ways of coding in TypeScript specifically.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import { createVariations } from '../lib/rule-variations.js';
import { tsFiles } from '../constants.js';

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
