import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]}*/
const recommended = [
	configs.javascript.recommended,
	configs.typescript.recommended,
	configs.formatting.recommended,
];
export default recommended;
