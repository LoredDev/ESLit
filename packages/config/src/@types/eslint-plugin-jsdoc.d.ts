import type { ESLint } from 'eslint';

/**
 * @see {@link https://www.npmjs.org/package/eslint-plugin-jsdoc npm package}
 *
 * @summary JSDoc specific linting rules for ESLint.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with ESLint new flat
 * config types. ESlint already has backwards compatibility for plugins not created in the
 * new flat config.
 */
declare module 'eslint-plugin-jsdoc' {
	interface jsDocESlintPlugin extends ESLint.Plugin {
		configs: ESLint.Plugin['configs'] & {
			recommended: ESLint.ConfigData
			'recommended-error': ESLint.ConfigData
			'recommended-typescript': ESLint.ConfigData
			'recommended-typescript-error': ESLint.ConfigData
			'recommended-typescript-flavor': ESLint.ConfigData
			'recommended-typescript-flavor-error': ESLint.ConfigData
		}
	}
	declare const plugin: jsDocESlintPlugin;
	export default plugin;
}
