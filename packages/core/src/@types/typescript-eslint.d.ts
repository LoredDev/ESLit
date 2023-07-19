import type { ESLint, Linter } from 'eslint';

/**
 * @see {@link https://www.npmjs.com/package/@typescript-eslint/eslint-plugin npm package}
 *
 * @summary An ESLint plugin which provides lint rules for TypeScript codebases.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with ESLint new flat
 * config types. ESlint already has backwards compatibility for plugins not created in the
 * new flat config.
 */
declare module '@typescript-eslint/eslint-plugin' {
	interface typescriptEslintPlugin extends ESLint.Plugin {
		configs: {
			recommended: {
				rules: Linter.RulesRecord
			}
			'recommended-requiring-type-checking': {
				rules: Linter.RulesRecord
			}
			'eslint-recommended': {
				rules: Linter.RulesRecord
			}
			strict: {
				rules: Linter.RulesRecord
			}
		}
	}
	declare const plugin: typescriptEslintPlugin;
	export default plugin;
}

/**
 * @see {@link https://www.npmjs.com/package/@typescript-eslint/parser npm package}
 *
 * @summary An ESLint parser which leverages TypeScript ESTree to allow for ESLint
 * to lint TypeScript source code.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with ESLint new flat
 * config types. ESlint already has backwards compatibility for parsers not created in the
 * new flat config.
 */
declare module '@typescript-eslint/parser' {
	declare const parser: Linter.ParserModule;
	export default parser;
}
