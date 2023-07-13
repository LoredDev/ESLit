
/**
 * Common configuration related to language features of Javascript and Typescript
 * @type {import('../types').ESConfig}
 */
const config = {
	files: ['**/*.js', '**/*.ts'],
	rules: {
		'@typescript-eslint/ban-ts-comment': ['error', {
			'ts-ignore': 'allow-with-description',
		}],

		'@typescript-eslint/no-require-imports': 'error',

		// Extension rules

		'no-dupe-class-members': 'off',
		'@typescript-eslint/no-dupe-class-members': 'error',

		'no-invalid-this': 'off',
		'@typescript-eslint/no-invalid-this': 'error',

		'no-redeclare': 'off',
		'@typescript-eslint/no-redeclare': 'error',

		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': 'error',
	},
};
export default config;
