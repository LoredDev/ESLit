/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
import { createVariations } from '../../lib/rule-variations.js';
import { jsFiles, tsFiles } from '../../constants.js';

/** @type {import('../index.d.ts').ConfigVariations} */
const commonjs = createVariations({
	files: ['**/*.cts', '**/*.cjs'],
	rules: {
		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-var-requires': 'off',

		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-module': 'off',

		...{}, // Plugin: eslint-plugin-import
		'import/no-commonjs': 'off',
	},
});

/** @type {import('../index.d.ts').ConfigVariations} */
const recommended = createVariations({
	files: [...tsFiles, ...jsFiles],
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-node-protocol': 'error',

		...{}, // Plugin: eslint-plugin-import
		'import/no-dynamic-require': 'error',
	},
});

/** @type {import('../index.d.ts').ConfigVariations} */
const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,
	},
});

const node = { commonjs, recommended, strict };
export default node;
