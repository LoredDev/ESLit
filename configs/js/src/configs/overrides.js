/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
/**
 * @file
 * Overrides for specific scenarios or preferences of users. The objects
 * are supposed to be placed on the end of the arrays and can
 * change configs of multiple other categories.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 * @todo This file is not completed fully.
 */

import { createVariations } from '../lib/rule-variations.js';
import { FILES, TS_FILES } from '../constants.js';

// TODO [>=1.0.0]: Create a separate config for performance related practices
const performance = createVariations({
	files: FILES,
	rules: {
		'prefer-object-spread': 'off',
		'prefer-spread': 'off',
	},
});

const inferrableTypes = createVariations({
	files: TS_FILES,
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/typedef': 'off',
	},
});

const overrides = { 'inferrable-types': inferrableTypes, performance };
export default overrides;
