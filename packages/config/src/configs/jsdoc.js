import jsdoc from 'eslint-plugin-jsdoc';

/**
 * JSDoc rules overrides
 * @type {Readonly<import('eslint').Linter.FlatConfig>}
 */
const config = {
	files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	rules: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		...jsdoc.configs['recommended-typescript-flavor-error'].rules,
	},
};
export default config;
