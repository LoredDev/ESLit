/* eslint-disable unicorn/no-useless-spread */
// eslint-disable-next-line import/no-relative-parent-imports
import { jsFiles, tsFiles } from '../constants.js';

/**
 * This config relates to possible logic and syntax errors JavaScript and TypeScript
 * Recommended alternative, better for projects in prototyping phases.
 * @type {import('eslint').Linter.FlatConfig}
 */
const recommended = {
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // ESLint rules
		'constructor-super': 'error',
		'for-direction': 'error',
		'getter-return': 'error',
		'no-async-promise-executor': 'error',
		'no-class-assign': 'error',
		'no-compare-neg-zero': 'error',
		'no-cond-assign': 'error',
		'no-const-assign': 'error',
		'no-constant-condition': 'error',
		'no-control-regex': 'error',
		'no-debugger': 'error',
		'no-delete-var': 'error',
		'no-dupe-args': 'error',
		'no-dupe-class-members': 'error',
		'no-dupe-else-if': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-empty-character-class': 'error',
		'no-empty-pattern': 'error',
		'no-ex-assign': 'error',
		'no-fallthrough': 'error',
		'no-func-assign': 'error',
		'no-global-assign': 'error',
		'no-import-assign': 'error',
		'no-inner-declarations': 'error',
		'no-invalid-regexp': 'error',
		'no-irregular-whitespace': 'error',
		'no-misleading-character-class': 'error',
		'no-new-symbol': 'error',
		'no-obj-calls': 'error',
		'no-octal': 'error',
		'no-octal-decimal-escape': 'error',
		'no-prototype-builtins': 'error',
		'no-regex-spaces': 'error',
		'no-self-assign': 'error',
		'no-setter-return': 'error',
		'no-shadow-restricted-names': 'error',
		'no-sparse-arrays': 'error',
		'no-this-before-super': 'error',
		'no-undef': 'error',
		'no-unexpected-multiline': 'error',
		'no-unreachable': 'error',
		'no-unsafe-finally': 'error',
		'no-unsafe-negation': 'error',
		'no-unsafe-optional-chaining': 'error',
		'no-unused-labels': 'error',
		'no-unused-vars': 'error',
		'no-useless-backreference': 'error',
		'use-isnan': 'error',
		'valid-typeof': 'error',

		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/no-loss-of-precision': 'error',
		'@typescript-eslint/no-redeclare': 'error',
		'no-loss-of-precision': 'off',
		'no-redeclare': 'off',

		...{}, // Plugin: eslint-plugin-import
		'import/default': 'error',
		'import/export': 'error',
		'import/named': 'error',
		'import/namespace': 'error',
		'import/no-unresolved': 'error',
	},
};

/**
 * This config relates to possible logic and syntax errors JavaScript and TypeScript
 * Strict alternative, better for projects in refactoring and/or production phases.
 * @type {import('eslint').Linter.FlatConfig}
 */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,

		...{}, // ESLint rules
		'no-constant-binary-expression': 'error',
		'no-new-native-nonconstructor': 'error',
		'no-promise-executor-return': 'error',
		'no-self-compare': 'error',
		'no-template-curly-in-string': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-unreachable-loop': 'error',
		'no-unused-private-class-members': 'error',
		'no-use-before-define': 'error',
		'require-atomic-updates': 'error',

		...{}, // Plugin: eslint-plugin-import
		'import/no-extraneous-dependencies': 'error',
	},
};

const problems = { recommended, strict };
export default problems;
