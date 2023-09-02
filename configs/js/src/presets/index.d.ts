import type { Linter } from 'eslint';

const presets: Readonly<{
	recommended: Linter.FlatConfig[],
	strict: Linter.FlatConfig[],
}>;

export default presets;
