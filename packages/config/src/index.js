import { eslintrc } from './eslintrc-compact.js';

/**
 * @param {import('./types').Config} config
 * Array or function returning an array of ESLint's configuration objects array to be used.
 * @param {import('./types').EnvOptions | undefined} environment
 * An object with environment variables to be declared and used by the configuration.
 * @returns {Promise<import('eslint').Linter.FlatConfig[]>}
 * The array of ESLint's configuration objects.
 */
export async function defineConfig(config, environment = {}) {
	for (const [key, value] of Object.entries(environment)) {
		process.env[key] = JSON.stringify(value);
	}
	return typeof config === 'function' ? await config(eslintrc) : config;
}

export { default as configs } from './configs/index.js';
export { default as presets } from './presets/index.js';

