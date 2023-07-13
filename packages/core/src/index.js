import { eslintrc } from './eslintrc-compact.js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import * as configs from './configs/index.js';
import globals from 'globals';
import { getUserRules } from './userOptions.js';

/**
 * @param {import('./types').Config} userConfig
 *
 * @returns {import('./types').ESConfig[]}
*/
export function defineConfig(userConfig) {
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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				globals: {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					...globals.nodeBuiltin,
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
		...getUserRules(userConfig.options),
	];
}

