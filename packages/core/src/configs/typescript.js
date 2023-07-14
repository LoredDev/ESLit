/**
 * Typescript syntax-specific configuration
 * @type {import('../types').ESConfig}
 */
const config = {
	files: ['**/*.ts'],
	rules: {
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': 'error',
		'@typescript-eslint/class-literal-property-style': 'error',
		'@typescript-eslint/consistent-generic-constructors': 'error',
		'@typescript-eslint/consistent-indexed-object-style': 'error',
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/consistent-type-exports': ['error'],
		'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: true }],
		'@typescript-eslint/no-confusing-non-null-assertion': 'error',
		'@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
	},
};
export default config;
