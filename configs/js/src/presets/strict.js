// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const strict = [
	configs.core,
	// TODO [>=1.0.0]: remove .javascript and .typescript configs
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	configs.javascript.strict,
	configs['suggestions-typescript'].strict,
	configs.suggestions.strict,
	configs.formatting.strict,
	configs.naming.strict,
];
export default strict;
