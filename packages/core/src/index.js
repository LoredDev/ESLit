import { eslintrc } from './eslintrc-compact.js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import * as configs from './configs/index.js';

/**
 * @param {import('./types').Config} userConfig
 *
 * @returns {import('./types').ESConfig[]}
*/
export function defineConfig(userConfig) {

	// eslint-disable-next-line no-undef
	process.env.READABLE_CONFIG_INDENT = userConfig.options?.indent ?? 'tab';
	// eslint-disable-next-line no-undef
	process.env.READABLE_CONFIG_SEMI = userConfig.options?.semi ?? 'always';
	// eslint-disable-next-line no-undef
	process.env.READABLE_CONFIG_QUOTES = userConfig.options?.quotes ?? 'single';

	return [
		{
			ignores: [
				'**/node_modules',
				'**/dist',
				'**/fixtures',
			],
		},
		js.configs.recommended,
		{
			files: ['**/*.js', '**/*.ts'],
			plugins: {
				// @ts-expect-error The `@typescript-eslint/eslint-plugin` package doesn't export
				// a correct type as default. But this still works because of backwards-compatibility of eslint.
				'@typescript-eslint': tsEslint,
			},
			languageOptions: {
				sourceType: 'module',
				// @ts-expect-error The `@typescript-eslint/parser` package doesn't export a correct type as default.
				// (see `plugins['@typescript-eslint']` option/property error for more info)
				parser: tsParser,
				parserOptions: {
					project: userConfig.tsconfig,
					// eslint-disable-next-line no-undef
					tsconfigRootDir: process.cwd(),
				},
			},
			// @ts-expect-error The `@typescript-eslint/eslint-plugin` package doesn't export
			// rules as `RulesRecord` type.
			rules: {
				...tsEslint.configs.recommended.rules,
				...tsEslint.configs['recommended-requiring-type-checking'].rules,
				...tsEslint.configs['eslint-recommended'].rules,
				...(userConfig.strict ? tsEslint.configs.strict.rules : null),
			},
		},
		configs.common,
		configs.formatting,
		configs.typescript,
	];
}

