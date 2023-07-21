/**
 * JSDoc rules overrides
 *
 * @type {import('../types').ESConfig}
 */
const config = {
	files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
	rules: {
		'jsdoc/tag-lines': ['error', 'always', {
			count: 1,
			applyToEndTag: false,
			startLines: 1,
			endLines: 0,
			tags: {
				param: { lines: 'never' },
			},
		}],
	},
};
export default config;
