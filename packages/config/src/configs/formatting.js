import coreConfig from './core.js';

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	...coreConfig,
	files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
	rules: {
		// Formatting rules

		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

		'import/exports-last': 'error',

		'import/first': 'error',

		'import/group-exports': 'error',

		'import/newline-after-import': ['error', { considerComments: true }],

		'brace-style': 'off',
		'@typescript-eslint/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],

		'comma-dangle': 'off',
		'@typescript-eslint/comma-dangle': ['error', 'always-multiline'],

		'indent': 'off',
		'@typescript-eslint/indent': ['error', 'tab', { SwitchCase: 1,
			VariableDeclarator: 1,
			outerIIFEBody: 1,
			MemberExpression: 1,
			FunctionDeclaration: { parameters: 1,
				body: 1 }, FunctionExpression: { parameters: 1,
				body: 1 }, CallExpression: { arguments: 1 }, ArrayExpression: 1,
			ObjectExpression: 1,
			ImportDeclaration: 1,
			flatTernaryExpressions: false, offsetTernaryExpressions: true, ignoreComments: false, ignoredNodes: [
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
			],
		}],

		'keyword-spacing': 'off',
		'@typescript-eslint/keyword-spacing': ['error', { before: true, after: true }],

		'lines-between-class-members': 'off',
		'@typescript-eslint/lines-between-class-members': ['error'],

		'no-extra-parens': 'off',
		'@typescript-eslint/no-extra-parens': ['error', 'functions'],

		'object-curly-spacing': 'off',
		'@typescript-eslint/object-curly-spacing': ['error', 'always'],

		'quotes': 'off',
		'@typescript-eslint/quotes': ['error', 'single'],

		'semi': 'off',
		'@typescript-eslint/semi': ['error', 'always'],

		'space-before-blocks': 'off',
		'@typescript-eslint/space-before-blocks': ['error', 'always'],

		'space-before-function-paren': 'off',
		'@typescript-eslint/space-before-function-paren': ['error', {
			anonymous: 'always',
			named: 'never',
			asyncArrow: 'always',
		}],

		'space-infix-ops': 'off',
		'@typescript-eslint/space-infix-ops': 'error',

	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
};

const formatting = { recommended, strict };
export default formatting;
