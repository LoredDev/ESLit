// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const recommended = [
	configs.core,
	configs['suggestions-typescript'].recommended.error,
	configs.suggestions.recommended.error,
	configs.formatting.recommended.error,
	configs.naming.recommended.error,
	configs.documentation.recommended.error,
];
export default recommended;
