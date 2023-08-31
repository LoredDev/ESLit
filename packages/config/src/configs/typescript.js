
import jsdocPlugin from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-i';
import { tsFiles } from '../constants.js';

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	files: [...tsFiles],
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	rules: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		...jsdocPlugin.configs['recommended-typescript-error'].rules,
		...importPlugin.configs['typescript'].rules,

		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': 'error',
		'@typescript-eslint/class-literal-property-style': 'error',
		'@typescript-eslint/consistent-generic-constructors': 'error',
		'@typescript-eslint/consistent-indexed-object-style': 'error',
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/consistent-type-exports': ['error'],
		'@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: true, prefer: 'type-imports' }],
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
		'@typescript-eslint/no-confusing-non-null-assertion': 'error',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/type-annotation-spacing': 'error',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
};
const typescript = { recommended, strict };
export default typescript;
