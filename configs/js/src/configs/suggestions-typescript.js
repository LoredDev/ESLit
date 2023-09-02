
// eslint-disable-next-line import/no-relative-parent-imports
import { tsFiles } from '../constants.js';

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	files: [...tsFiles],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'error',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,
		'@typescript-eslint/explicit-member-accessibility': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
	},
};
const typescript = { recommended, strict };
export default typescript;
