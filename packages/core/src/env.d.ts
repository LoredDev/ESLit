import type { ESLint, Linter } from 'eslint';

/**
 * @see {@link https://github.com/sindresorhus/globals github repository}
 * @summary Global identifiers from different Javascript environments
 * ---
 * **Note:**
 *
 * The `globals` package type declarations doesn't seems to be working properly,
 * so the used globals are declared here so the type-checking doesn't error.
 *
 * Also, because of this manual declaration, we can filter just the globals that
 * are recommended/should be used in normal development/environments today.
 */
declare module 'globals' {
	const globals: {
		builtin: Record<string, boolean>
		browser: Record<string, boolean>
		node: Record<string, boolean>
		nodeBuiltin: Record<string, boolean>
		commonjs: Record<string, boolean>
	};
	export default globals;
}

/**
 * @see {@link https://www.npmjs.com/package/@typescript-eslint/eslint-plugin npm package}
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
	const plugin: typescriptEslintPlugin;
	export default plugin;
}

/**
 * @see {@link https://www.npmjs.com/package/@typescript-eslint/parser npm package}
 * @summary An ESLint parser which leverages TypeScript ESTree to allow for ESLint
 * to lint TypeScript source code.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with ESLint new flat
 * config types. ESlint already has backwards compatibility for parsers not created in the
 * new flat config.
 */
declare module '@typescript-eslint/parser' {
	const parser: Linter.ParserModule;
	export default parser;
}
