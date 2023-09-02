/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../constants.js';

/** @type {import('./index.d.ts').ConfigVariations} */
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

/** @type {import('./index.d.ts').ConfigVariations} */
const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,

		...{}, // Plugin: eslint-plugin-jsdoc
		'jsdoc/require-description': 'error',
		'jsdoc/require-file-overview': 'error',
	},
});

const documentation = { recommended, strict };
export default documentation;
