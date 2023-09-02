import type { Linter } from 'eslint';

interface ConfigVariations {
	/**
	 * Enable all rules with `error` level.
	 */
	error: Linter.FlatConfig,
	/**
	 * Disable all rules in this config.
	 */
	off: Linter.FlatConfig,
	/**
	 * Enable all rules with `warn` level.
	 */
	warn: Linter.FlatConfig,
}

const configs: Readonly<{
	core: Linter.FlatConfig,
	documentation: {
		recommended: ConfigVariations,
		strict: ConfigVariations,
	},
	environments: {
		browser: {
			recommended: ConfigVariations,
			strict: ConfigVariations,
		},
		node: {
			commonjs: ConfigVariations,
			recommended: ConfigVariations,
			strict: ConfigVariations,
		},
	},
	formatting: {
		recommended: ConfigVariations,
		strict: ConfigVariations,
	},
	naming: {
		recommended: ConfigVariations,
		strict: ConfigVariations,
	},
	overrides: {
		'inferrable-types': ConfigVariations,
		performance: ConfigVariations,
	},
	suggestions: {
		recommended: ConfigVariations,
		strict: ConfigVariations,
	},
	'suggestions-typescript': {
		recommended: ConfigVariations,
		strict: ConfigVariations,
	},
}>;

export default configs;
export type { ConfigVariations };
