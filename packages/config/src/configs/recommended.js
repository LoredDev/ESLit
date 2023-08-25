import tsESlint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-i';

/**
 * Recommended configuration overrides of ESLit
 * @type {Readonly<import('eslint').Linter.FlatConfig>}
 */
const config = {
	rules: {
		...js.configs.recommended.rules,
		...tsESlint.configs.recommended.rules,
		...tsESlint.configs['recommended-requiring-type-checking'].rules,
		...tsESlint.configs['eslint-recommended'].rules,
		...tsESlint.configs.strict.rules,
		...importPlugin.configs['recommended'].rules,

		'import/extensions': ['error', 'always', { ignorePackages: true }],

		'import/no-anonymous-default-export': ['error'],

		'import/no-absolute-path': 'error',

		'import/no-amd': 'error',

		'import/no-commonjs': 'error',

		'import/no-cycle': 'error',

		'import/no-deprecated': 'error',

		'import/no-duplicates': ['error', { 'prefer-inline': false }],

		'import/no-empty-named-blocks': 'error',

		'import/no-extraneous-dependencies': 'error',

		'import/no-import-module-exports': 'error',

		'import/no-mutable-exports': 'error',

		'import/no-named-as-default-member': 'error',

		'import/no-named-as-default': 'warn',

		'import/no-named-default': 'error',

		'import/no-namespace': 'error',

		'import/no-relative-packages': 'error',

		'import/no-self-import': 'error',

		'import/no-unassigned-import': ['error', { allow: ['**/*.{scss,less,css}'] }],

		'import/no-useless-path-segments': 'error',

		'import/prefer-default-export': 'error',

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
