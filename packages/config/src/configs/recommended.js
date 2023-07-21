import tsESlint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';

/**
 * Recommended configuration overrides of ESLit
 *
 * @type {Readonly<import('eslint').Linter.FlatConfig>}
 */
const config = {
	rules: {
		...js.configs.recommended.rules,
		...tsESlint.configs.recommended.rules,
		...tsESlint.configs['recommended-requiring-type-checking'].rules,
		...tsESlint.configs['eslint-recommended'].rules,
		...tsESlint.configs.strict.rules,

		'@typescript-eslint/ban-ts-comment': ['error', {
			'ts-ignore': 'allow-with-description',
		}],
		'@typescript-eslint/ban-tslint-comment': 'error',

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

		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'error',
	},
};
export default config;
