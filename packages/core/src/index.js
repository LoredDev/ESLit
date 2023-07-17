import { eslintrc } from './eslintrc-compact.js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import * as configs from './configs/index.js';
import { getUserRules } from './userOptions.js';
import { setEnvironments } from './environments.js';

/**
 * @param {import('./types').Config} userConfig
 *
 * @returns {import('./types').ESConfig[]}
*/
	userConfig.strict ??= true;

	process.env.READABLE_ESLINT_STRICT = userConfig.strict;
	process.env.READABLE_ESLINT_OPTIONS = {
		inferrableTypes: userConfig.strict ? 'always' : 'never',
		...userConfig.options,
	};
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
				'@typescript-eslint': tsEslint,
			},
			languageOptions: {
				sourceType: 'module',
				parser: tsParser,
				parserOptions: {
					project: userConfig.tsconfig,
					tsconfigRootDir: process.cwd(),
				},
			},
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
		...setEnvironments(userConfig.environment),
	];
}

