import { eslintrc } from './eslintrc-compact.js';
import tsESlint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsdoc from 'eslint-plugin-jsdoc';
import js from '@eslint/js';
import * as configs from './configs/index.js';
import { getTsConfigs } from './tsconfigs.js';

/**
 * @param {import('./types').Config} userConfig
 * User configuration
 * @returns {Promise<import('./types').ESConfig[]>}
 * The complete list of configs for ESLint
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
				'**/pnpm-lock.yaml',
				'**/yarn.lock',
				'**/package-lock.json',
			],
		},
		js.configs.recommended,
		{
			files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
			plugins: {
				'@typescript-eslint': tsESlint,
				/**
				 * @todo
				 * Fix eslint-plugin-jsdoc type definitions.
				 * _Typescript should have detected [eslint-plugin-jsdoc.d.ts](./@types/eslint-plugin-jsdoc.d.ts)._
				 */
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				'jsdoc': jsdoc,
			},
			languageOptions: {
				sourceType: 'module',
				parser: tsParser,
				parserOptions: {
					project: userConfig.tsconfig,
					tsconfigRootDir: userConfig.rootDir,
				},
			},
			// See plugins['jsdoc'] for more info on this error
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			rules: {
				...tsESlint.configs.recommended.rules,
				...tsESlint.configs['recommended-requiring-type-checking'].rules,
				...tsESlint.configs['eslint-recommended'].rules,
				...(userConfig.strict ? tsESlint.configs.strict.rules : null),
				// See plugins['jsdoc'] for more info on this error
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				...jsdoc.configs['recommended-typescript-flavor-error'].rules,
			},
		},
		configs.common,
		configs.formatting,
		configs.jsdoc,
		configs.typescript,
		...configs.environments(userConfig.environment),
		...userOverrides,
	];
}

