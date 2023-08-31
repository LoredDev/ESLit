import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const strict = [
	configs.core,
	configs.javascript.strict,
	configs.typescript.strict,
	configs.suggestions.strict,
	configs.formatting.strict,
];
export default strict;
