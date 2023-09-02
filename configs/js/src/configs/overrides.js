import { jsFiles, tsFiles } from '../constants.js';

// TODO [>=1.0.0]: Create a separate config for performance related practices
/** @type {import('eslint').Linter.FlatConfig} */
const performance = {
	files: [...tsFiles, ...jsFiles],
	rules: {
		'prefer-object-spread': 'off',
		'prefer-spread': 'off',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const inferrableTypes = {
	files: [...tsFiles],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/typedef': 'off',
	},
};

const overrides = { inferrableTypes, performance };
export default overrides;
