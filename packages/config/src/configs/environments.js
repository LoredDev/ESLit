import globals from 'globals';

/**
 * Configuration for Node development environment
 * @type {import('eslint').Linter.FlatConfig}
 */
const node = {
	files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
	languageOptions: {
		globals: {
			...globals.nodeBuiltin,
		},
	},
};

/**
 * Configuration for Deno development environment
 * @type {import('eslint').Linter.FlatConfig}
 */
const deno = {
	files: ['**/*.js', '**/*.ts'],
	languageOptions: {
		globals: {
			Deno: true,
			...globals.browser,
		},
	},
};

/**
 * Configuration for browser development environment
 * @type {import('eslint').Linter.FlatConfig}
 */
const browser = {
	files: ['**/*.js', '**/*.ts'],
	languageOptions: {
		globals: {
			Deno: true,
			...globals.browser,
		},
	},
};

export default { node, deno, browser };
