import { eslintrc } from './eslintrc-compact.js';
import rules from './rules.js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';

/**
 * @param {import('./types').Config} config
 *
 * @returns {import('./types').ESConfig[]}
*/
export function defineConfig({
	tsconfig,
	// indent = 'tab',
	strict = true,
}) {
	return [
		{
			ignores: [
				'**/node_modules',
				'**/dist',
				'**/fixtures',
			]
		},
		js.configs.recommended,
		{
			plugins: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				'@typescript-eslint': tsEslint
			},
			languageOptions: {
				sourceType: 'module',
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				parser: tsParser,
				parserOptions: {
					project: tsconfig,
					// eslint-disable-next-line no-undef
					tsconfigRootDir: process.cwd()
				}
			},
			files: ['**/*.ts', '**/*.js'],
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			rules: {
				...tsEslint.configs.recommended.rules,
				...tsEslint.configs['recommended-requiring-type-checking'].rules,
				...tsEslint.configs['eslint-recommended'].rules,
				...(strict ? tsEslint.configs.strict.rules : null)
			}
		}
	]
}

