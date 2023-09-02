/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../../constants.js';

/** @type {import('../index.d.ts').ConfigVariations} */
const recommended = createVariations({
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
});

/** @type {import('../index.d.ts').ConfigVariations} */
const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,
	},
});

const node = { recommended, strict };
export default node;
