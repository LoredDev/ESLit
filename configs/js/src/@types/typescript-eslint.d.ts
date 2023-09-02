/**
 * @file
 * Type declaration for the `@typescript-eslint/eslint-plugin` and
 * `@typescript-eslint/parser` packages in a attempt to make it
 * compatible with the new flat config.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import type { ESLint, Linter } from 'eslint';

/**
 * @summary An ESLint plugin which provides lint rules for TypeScript codebases.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with ESLint
 * new flat config types. ESlint already has backwards compatibility for plugins
 * not created in the new flat config.
 * @see {@link https://www.npmjs.com/package/@typescript-eslint/eslint-plugin npm package}
 */
declare module '@typescript-eslint/eslint-plugin' {
	interface typescriptEslintPlugin extends ESLint.Plugin {
		configs: {
			'eslint-recommended': {
				rules: Linter.RulesRecord,
			},
			recommended: {
				rules: Linter.RulesRecord,
			},
			'recommended-requiring-type-checking': {
				rules: Linter.RulesRecord,
			},
			strict: {
				rules: Linter.RulesRecord,
			},
		},
	}
	declare const plugin: typescriptEslintPlugin;
	export default plugin;
}

/**
 * @summary An ESLint parser which leverages TypeScript ESTree to
 * allow for ESLint to lint TypeScript source code.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible
 * with ESLint new flat config types. ESlint already has backwards
 * compatibility for parsers not created in the new flat config.
 * @see {@link https://www.npmjs.com/package/@typescript-eslint/parser npm package}
 */
declare module '@typescript-eslint/parser' {
	declare const parser: Linter.ParserModule;
	export default parser;
}
