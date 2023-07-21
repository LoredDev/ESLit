import tsESLint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsdoc from 'eslint-plugin-jsdoc';

/**
 * Common configuration for using ESLit rules overrides.
 *
 * @type {Readonly<import('eslint').Linter.FlatConfig>}
 */
const config = {
	files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
	plugins: {
		'@typescript-eslint': tsESLint,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		'jsdoc': jsdoc,
	},
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			project: process.env.ESLIT_TSCONFIG ?? [
				'./{ts,js}config{.eslint,}.json',
				'./packages/*/{ts,js}config{.eslint,}.json',
				'./apps/*/{ts,js}config{.eslint,}.json',
			],
			tsconfigRootDir: process.env.ESLIT_ROOT ?? process.cwd(),
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		ecmaVersion: (
			/** @type {import('eslint').Linter.ParserOptions['ecmaVersion']} */
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			() => {return JSON.parse(process.env.ESLIT_ECMASCRIPT ?? '"latest"');}
		)(),
	},
};
export default config;
