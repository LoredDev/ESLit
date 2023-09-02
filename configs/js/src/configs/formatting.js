/* eslint-disable unicorn/no-useless-spread */
import perfectionistPlugin from 'eslint-plugin-perfectionist';
// eslint-disable-next-line import/no-relative-parent-imports
import { jsFiles, tsFiles } from '../constants.js';

/**
 * This config relates to code formatting and style in JavaScript and TypeScript
 * Recommended alternative, better for projects in prototyping phases.
 * @type {import('eslint').Linter.FlatConfig}
 */
const recommended = {
	files: [...tsFiles, ...jsFiles],
	plugins: {
		// @ts-expect-error because plugin doesn't export correct type
		perfectionist: perfectionistPlugin,
	},
	rules: {
		...{}, // ESLint rules
		'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
		'comma-style': 'error',
		'curly': ['error', 'multi-or-nest', 'consistent'],
		'generator-star-spacing': ['error', 'before'],
		'no-mixed-spaces-and-tabs': 'error',
		'spaced-comment': ['error', 'always', {
			block: {
				balanced: true,
				exceptions: ['*'],
				markers: ['!'],
			},
			line: {
				exceptions: ['/', '#'],
				markers: ['/'],
			},
		}],
		'template-curly-spacing': ['error', 'never'],

		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/block-spacing': ['error', 'always'],
		'@typescript-eslint/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
		'@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
		'@typescript-eslint/comma-spacing': 'error',
		'@typescript-eslint/func-call-spacing': 'error',
		'@typescript-eslint/indent': ['error', 'tab', { ArrayExpression: 1,
			CallExpression: { arguments: 1 },
			FunctionDeclaration: { body: 1,
				parameters: 1 },
			FunctionExpression: { body: 1,
				parameters: 1 },
			ImportDeclaration: 1, MemberExpression: 1, ObjectExpression: 1, SwitchCase: 1,
			VariableDeclarator: 1,
			flatTernaryExpressions: false,
			ignoreComments: false, ignoredNodes: [
				'TemplateLiteral *',
				'JSXElement',
				'JSXElement > *',
				'JSXAttribute',
				'JSXIdentifier',
				'JSXNamespacedName',
				'JSXMemberExpression',
				'JSXSpreadAttribute',
				'JSXExpressionContainer',
				'JSXOpeningElement',
				'Element',
				'JSXFragment',
				'JSXOpeningFragment',
				'JSXClosingFragment',
				'JSXText',
				'JSXEmptyExpression',
				'JSXSpreadChild',
				'TSTypeParameterInstantiation',
				'FunctionExpression > .params[decorators.length > 0]',
				'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
				'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
			], offsetTernaryExpressions: true, outerIIFEBody: 1,
		}],
		'@typescript-eslint/key-spacing': ['error', { afterColon: true, beforeColon: false }],
		'@typescript-eslint/keyword-spacing': ['error', { after: true, before: true }],
		'@typescript-eslint/lines-between-class-members': ['error'],
		'@typescript-eslint/no-extra-parens': ['error', 'functions'],
		'@typescript-eslint/object-curly-spacing': ['error', 'always'],
		'@typescript-eslint/quotes': ['error', 'single'],
		'@typescript-eslint/semi': ['error', 'always'],
		'@typescript-eslint/space-before-blocks': ['error', 'always'],
		'@typescript-eslint/space-before-function-paren': ['error', {
			anonymous: 'always',
			asyncArrow: 'always',
			named: 'never',
		}],
		'@typescript-eslint/space-infix-ops': 'error',
		'block-spacing': 'off',
		'brace-style': 'off',
		'comma-dangle': 'off',
		'comma-spacing': 'off',
		'func-call-spacing': 'off',
		'indent': 'off',
		'key-spacing': 'off',
		'keyword-spacing': 'off',
		'lines-between-class-members': 'off',
		'object-curly-spacing': 'off',
		'quotes': 'off',
		'semi': 'off',
		'space-before-blocks': 'off',
		'space-before-function-paren': 'off',
		'space-infix-ops': 'off',

		...{}, // Plugin: eslint-plugin-i (eslint-plugin-import)
		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
		'import/exports-last': 'error',
		'import/first': 'error',
		'import/group-exports': 'error',

		...{}, // Plugin: eslint-plugin-perfectionist
		...perfectionistPlugin.configs['recommended-natural'].rules,

		'perfectionist/sort-exports': ['error', { type: 'line-length' }],
		'perfectionist/sort-imports': ['error', { order: 'desc', type: 'line-length' }],

	},
};

/**
 * This config relates to code formatting and style in JavaScript and TypeScript
 * Strict alternative, better for projects in refactoring and/or production phases.
 * @type {import('eslint').Linter.FlatConfig}
 */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,
	},
};

const formatting = { recommended, strict };
export default formatting;
