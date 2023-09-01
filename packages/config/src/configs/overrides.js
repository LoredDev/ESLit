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

const overrides = { performance };
export default overrides;
