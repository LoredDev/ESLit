// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const strict = [
	configs.core,
	configs['suggestions-typescript'].strict.error,
	configs.suggestions.strict.error,
	configs.formatting.strict.error,
	configs.naming.strict.error,
	configs.documentation.recommended.error,
];
export default strict;
