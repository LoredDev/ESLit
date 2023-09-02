/* eslint-disable unicorn/no-useless-spread */
// eslint-disable-next-line import/no-relative-parent-imports
import { jsFiles, tsFiles } from '../../constants.js';

/** @type {import('eslint').Linter.FlatConfig} */
const recommended = {
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-add-event-listener': 'error',
		'unicorn/prefer-dom-node-append': 'error',
		'unicorn/prefer-dom-node-dataset': 'error',
		'unicorn/prefer-dom-node-remove': 'error',
		'unicorn/prefer-dom-node-text-content': 'error',
		'unicorn/prefer-keyboard-event-key': 'error',
		'unicorn/prefer-modern-dom-apis': 'error',
		'unicorn/prefer-query-selector': 'error',
	},
};

/** @type {import('eslint').Linter.FlatConfig} */
const strict = {
	...recommended,
	rules: {
		...recommended.rules,
	},
};

const node = { recommended, strict };
export default node;
