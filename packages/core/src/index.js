import { eslintrc } from './eslintrc-compact.js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import * as configs from './configs/index.js';
import { getTsConfigs } from './tsconfigs.js';

/**
 * @param {import('./types').Config} userConfig
 *
 * @returns {Promise<import('./types').ESConfig[]>}
*/
export async function defineConfig(userConfig) {

	userConfig.strict ??= true;
	userConfig.rootDir ??= process.cwd();
	userConfig.tsconfig ??= await getTsConfigs(userConfig.rootDir);

	process.env.READABLE_ESLINT_STRICT = userConfig.strict;
	process.env.READABLE_ESLINT_OPTIONS = {
		inferrableTypes: userConfig.strict ? 'always' : 'never',
		...userConfig.options,
	};

	const userOverrides = (typeof userConfig.overrides !== 'function'
		? userConfig.overrides
		: await userConfig.overrides(eslintrc)) ?? [];

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
			files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
			plugins: {
				'@typescript-eslint': tsEslint,
			},
			languageOptions: {
				sourceType: 'module',
				parser: tsParser,
				parserOptions: {
					project: userConfig.tsconfig,
					tsconfigRootDir: userConfig.rootDir,
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
		...configs.environments(userConfig.environment),
		...userOverrides,
	];
}

