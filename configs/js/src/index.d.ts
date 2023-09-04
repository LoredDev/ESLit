/**
 * @file
 * Types entrypoint of the package.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import type { Linter } from 'eslint';

export { default as presets } from './presets/index.d.ts';
export { default as configs } from './configs/index.d.ts';

/**
 * Helper function to provide type-checking when defining
 * ESLint's configuration.
 *
 * @param config - The configuration array to be returned.
 * @returns The configuration array passed on the first parameter.
 */
export function defineConfig(
	config: Linter.FlatConfig[],
): Linter.FlatConfig[];
