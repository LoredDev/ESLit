/**
 * @file
 * Configuration objects that helps document your code.
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
		...{}, // Plugin: eslint-plugin-jsdoc
		'jsdoc/match-description': 'error',
		'jsdoc/require-description-complete-sentence': 'error',
		'jsdoc/require-hyphen-before-param-description': ['error', 'always'],
		'jsdoc/require-param-description': 'error',
		'jsdoc/require-property-description': 'error',
		'jsdoc/require-returns-check': 'error',
	},
});

const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,

		...{}, // Plugin: eslint-plugin-jsdoc
		'jsdoc/require-description': 'error',
		'jsdoc/require-file-overview': ['error', { tags: {
			author: {
				mustExist: true,
			},
			copyright: {
				initialCommentsOnly: true,
			},
			file: {
				initialCommentsOnly: true,
				mustExist: true,
				preventDuplicates: true,
			},
			license: {
				initialCommentsOnly: true,
				mustExist: true,
				preventDuplicates: true,
			},
		} }],
	},
});

const documentation = { recommended, strict };
export default documentation;
