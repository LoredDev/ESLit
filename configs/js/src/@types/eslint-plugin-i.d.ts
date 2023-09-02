/**
 * @file
 * Type declaration for the `eslint-plugin-i` package in a attempt to make it
 * compatible with the new flat config.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

// eslint-disable-next-line unicorn/prevent-abbreviations
import type { ESLint, Linter } from 'eslint';

/**
 * @summary ESLint plugin with rules that help validate proper imports.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with
 * ESLint new flat config types. ESlint already has backwards compatibility
 * for plugins not created in the new flat config.
 * @see {@link https://www.npmjs.com/package/eslint-plugin-import npm package}
 */
declare module 'eslint-plugin-i' {
	interface importEslintPlugin extends ESLint.Plugin {
		configs: {
			recommended: {
				rules: Linter.RulesRecord,
			},
			typescript: {
				rules: Linter.RulesRecord,
			},
		},
	}
	declare const plugin: importEslintPlugin;
	export default plugin;
}

