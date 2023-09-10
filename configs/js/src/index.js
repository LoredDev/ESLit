/**
 * @file
 * Main file entrypoint of the package.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import presets from './presets/index.js';
import configs from './configs/index.js';

/**
 * Helper function to provide type-checking when defining
 * ESLint's configuration.
 *
 * @param {import('eslint').Linter.FlatConfig[]} config
 * - The configuration array to be returned.
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
function defineConfig(config) {
	return config;
}

const eslegant = { configs, presets };

export { defineConfig, eslegant as default };
export { default as configs } from './configs/index.js';
export { default as presets } from './presets/index.js';
