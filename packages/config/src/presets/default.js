import configs from '../configs/index.js';

/**
 * @type {Readonly<import('eslint').Linter.FlatConfig[]>}
 */
const preset = [
	{
		ignores: [
			'**/node_modules',
			'**/dist',
			'**/fixtures',
			'**/pnpm-lock.yaml',
			'**/yarn.lock',
			'**/package-lock.json',
		],
	},
	configs.common,
	configs.recommended,
	configs.formatting,
	configs.jsdoc,
	configs.typescript,
];
export default preset;
