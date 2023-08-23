import type { Config, EnvOptions } from './src/types';
import type { Linter } from 'eslint';

/**
 * Helper functions for creating/configuring ESLint.
 * @param config - Array or function returning an array of ESLint's configuration objects array to be used.
 * @param environment - An object with environment variables to be declared and used by the configuration.
 * @returns The array of ESLint's configuration objects.
 */
export async function defineConfig(config: Config, environment?: EnvOptions): Promise<Linter.FlatConfig[]>;

export const configs: Readonly<{
	/**
	 * **This configuration is necessary to be used before any other one**.
	 * Common configuration for using ESLit rules overrides.
	 */
	common: Linter.FlatConfig
	/**
	 * Recommended configuration overrides of ESLit
	 */
	recommended: Linter.FlatConfig
	/**
	 * Formatting rules/configuration overrides for Javascript and Typescript
	 */
	formatting: Linter.FlatConfig
	/**
	 * Typescript specific configuration overrides
	 */
	typescript: Linter.FlatConfig
	/**
	 * Configuration objects for different development environments.
	 */
	environments: {
		/**
		 * Configuration for Node development environment
		 */
		node: Linter.FlatConfig
		/**
		 * Configuration for Deno development environment
		 */
		deno: Linter.FlatConfig
		/**
		 * Configuration for browser development environment
		 */
		browser: Linter.FlatConfig
	}
	/**
	 * JSDoc rules overrides
	 */
	jsdoc: Linter.FlatConfig
}>;

export const presets: Readonly<{
	default: Linter.FlatConfig[]
}>;
