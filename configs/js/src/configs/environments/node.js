/* eslint-disable unicorn/no-useless-spread */
import { jsFiles, tsFiles } from '../../constants.js';

/** @type {import('eslint').Linter.FlatConfig} */
const commonjs = {
	files: ['**/*.cts', '**/*.cjs'],
	rules: {
		'unicorn/prefer-module': 'off',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-node-protocol': 'error',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,
	},
};

const node = { commonjs, recommended, strict };
export default node;
