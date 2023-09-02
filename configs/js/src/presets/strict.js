// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const strict = [
	configs.core,
	configs['suggestions-typescript'].strict,
	configs.suggestions.strict,
	configs.formatting.strict,
	configs.naming.strict,
	configs.documentation.recommended,
];
export default strict;
