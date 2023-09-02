// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const recommended = [
	configs.core,
	configs['suggestions-typescript'].recommended,
	configs.suggestions.recommended,
	configs.formatting.recommended,
	configs.naming.recommended,
	configs.documentation.recommended,
];
export default recommended;
