/**
 * Typescript-specific configuration, mostly about it's type syntax
 * @type {import('../types').ESConfig}
 */
const config = {
	files: ['**/*.ts'],
	rules: {
		'@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: true }],
	},
};
export default config;
