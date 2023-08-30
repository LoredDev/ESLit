import type { Linter } from 'eslint';

const configs: Readonly<{
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
}>;

const presets: Readonly<{
	recommended: Linter.FlatConfig[]
}>;

export { configs, presets };
