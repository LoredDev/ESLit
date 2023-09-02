import type { Linter } from 'eslint';

const configs: Readonly<{
	core: Linter.FlatConfig
	environments: {
		browser: {
			recommended: Linter.FlatConfig
			strict: Linter.FlatConfig
		}
		node: {
			commonjs: Linter.FlatConfig
			recommended: Linter.FlatConfig
			strict: Linter.FlatConfig
		}
	}
	formatting: {
		recommended: Linter.FlatConfig
		strict: Linter.FlatConfig
	}
	naming: {
		recommended: Linter.FlatConfig
		strict: Linter.FlatConfig
	}
	overrides: {
		performance: Linter.FlatConfig
	}
	suggestions: {
		recommended: Linter.FlatConfig
		strict: Linter.FlatConfig
	}
	'suggestions-typescript': {
		recommended: Linter.FlatConfig
		strict: Linter.FlatConfig
	}
}>;

export default configs;
