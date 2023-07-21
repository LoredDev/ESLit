import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig} */
const node = {
	files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
	languageOptions: {
		globals: {
			...globals.nodeBuiltin,
		},
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const deno = {
	files: ['**/*.js', '**/*.ts'],
	languageOptions: {
		globals: {
			Deno: true,
			...globals.browser,
		},
	},
};

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
