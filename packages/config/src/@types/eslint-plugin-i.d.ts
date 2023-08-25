import type { ESLint, Linter } from 'eslint';

/**
 * @see {@link https://www.npmjs.com/package/eslint-plugin-import npm package}
 * @summary ESLint plugin with rules that help validate proper imports.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with ESLint new flat
 * config types. ESlint already has backwards compatibility for plugins not created in the
 * new flat config.
 */
declare module 'eslint-plugin-i' {
	interface importEslintPlugin extends ESLint.Plugin {
		configs: {
			recommended: {
				rules: Linter.RulesRecord
			}
			typescript: {
				rules: Linter.RulesRecord
			}
		}
	}
	declare const plugin: importEslintPlugin;
	export default plugin;
}

