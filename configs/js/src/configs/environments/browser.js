/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
/**
 * @file
 * Configuration objects for the browser environment.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import compatPlugin from 'eslint-plugin-compat';
import globals from 'globals';

import { createVariations } from '../../lib/rule-variations.js';
import { FILES } from '../../constants.js';

const recommended = createVariations({
	files: FILES,
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
	plugins: {
		compat: compatPlugin,
	},
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-add-event-listener': 'error',
		'unicorn/prefer-dom-node-append': 'error',
		'unicorn/prefer-dom-node-dataset': 'error',
		'unicorn/prefer-dom-node-remove': 'error',
		'unicorn/prefer-dom-node-text-content': 'error',
		'unicorn/prefer-keyboard-event-key': 'error',
		'unicorn/prefer-modern-dom-apis': 'error',
		'unicorn/prefer-query-selector': 'error',

		...{}, // Plugin: eslint-plugin-compat
		'compat/compat': 'error',
	},
});

const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,
	},
});

const browser = { recommended, strict };
export default browser;
