import tsESLint from '@typescript-eslint/eslint-plugin';
import { tsFiles, jsFiles } from '../constants.js';

// @ts-expect-error TEMPORALLY COMMENT
import tsParser from '@typescript-eslint/parser';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-i';
import process from 'node:process';

/** @type {import('eslint').Linter.FlatConfig}*/
const config = {
	files: [...tsFiles, ...jsFiles],
	plugins: {
		'@typescript-eslint': tsESLint,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		'jsdoc': jsdocPlugin,
		'import': importPlugin,
	},
	settings: {
		'import/extensions': [...tsFiles, ...jsFiles],
		'import/parsers': {
			'@typescript-eslint/parser': [...tsFiles, ...jsFiles ],
		},
		'import/resolver': {
			typescript: true,
			node: true,
		},
	},
	languageOptions: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		parser: tsParser,
		parserOptions: {
			project: process.env.ESLEGANT_TSCONFIG ?? [
				'./{ts,js}config{.eslint,}.json',
				'./packages/*/{ts,js}config{.eslint,}.json',
				'./apps/*/{ts,js}config{.eslint,}.json',
			],
			tsconfigRootDir: process.env.ESLEGANT_ROOT ?? process.cwd(),
		},
	},
};
export default config;
