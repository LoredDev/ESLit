/**
 * @file
 * Type declaration for the `eslint-plugin-compat` package in a attempt to make it
 * compatible with the new flat config.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import type { ESLint } from 'eslint';

/**
 * @summary Check the browser compatibility of your code.
 *
 * ---
 * **Note:** Types in this project where overridden to be compatible with
 * ESLint new flat config types. ESlint already has backwards compatibility
 * for plugins not created in the new flat config.
 * @see {@link https://www.npmjs.com/package/eslint-plugin-compat npm package}
 */
declare module 'eslint-plugin-compat' {
	declare const plugin: ESLint.Plugin;
	export default plugin;
}

