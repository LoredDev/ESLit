// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const recommended = [
	configs.core,
	// TODO [>=1.0.0]: remove .javascript and .typescript configs
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	configs.javascript.recommended,
	configs['suggestions-typescript'].recommended,
	configs.suggestions.recommended,
	configs.formatting.recommended,
	configs.naming.recommended,
];
export default recommended;
