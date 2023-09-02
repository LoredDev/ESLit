/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../constants.js';

// TODO [>=1.0.0]: Create a separate config for performance related practices
/** @type {import('./index.d.ts').ConfigVariations} */
const performance = createVariations({
	files: [...tsFiles, ...jsFiles],
	rules: {
		'prefer-object-spread': 'off',
		'prefer-spread': 'off',
	},
});

/** @type {import('./index.d.ts').ConfigVariations} */
const inferrableTypes = createVariations({
	files: [...tsFiles],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/typedef': 'off',
	},
});

const overrides = { 'inferrable-types': inferrableTypes, performance };
export default overrides;
