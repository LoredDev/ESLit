import type { EnvOptions } from './src/types';
import type { Linter } from 'eslint';

export async function defineConfig(config: Linter.FlatConfig[], environment?: EnvOptions): Promise<Linter.FlatConfig[]>;

export const configs: Readonly<{
	recommended: Linter.FlatConfig
	formatting: Linter.FlatConfig
	typescript: Linter.FlatConfig
	environments: {
		deno: Linter.FlatConfig
		node: Linter.FlatConfig
		browser: Linter.FlatConfig
	}
	jsdoc: Linter.FlatConfig
}>;

export const presets: Readonly<{
	default: Linter.FlatConfig[]
}>;
