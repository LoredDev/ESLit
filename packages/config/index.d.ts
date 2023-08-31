import type { Linter } from 'eslint';

const configs: Readonly<{
	/**
	 * Formatting rules/configuration overrides for Javascript and Typescript
	 */
	formatting: Linter.FlatConfig
	/**
	 * Recommended configuration overrides of ESLit
	 */
	recommended: Linter.FlatConfig
	/**
	 * Typescript specific configuration overrides
	 */
	typescript: Linter.FlatConfig
}>;

const presets: Readonly<{
	recommended: Linter.FlatConfig[]
	strict: Linter.FlatConfig[]
}>;

export { configs, presets };
