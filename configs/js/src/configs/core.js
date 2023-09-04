/**
 * @file
 * Configuration object that adds necessary plugins for the other objects.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import process from 'node:process';

import tsESLint from '@typescript-eslint/eslint-plugin';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';
// @ts-expect-error because the package doesn't export correct types
import tsParser from '@typescript-eslint/parser';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-i';
import globals from 'globals';

// eslint-disable-next-line import/no-relative-parent-imports
import { jsFiles, tsFiles } from '../constants.js';


/** @type {import('eslint').Linter.FlatConfig} */
const config = {
	files: [...tsFiles, ...jsFiles],
	languageOptions: {
		globals: {
			...globals.builtin,
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		parser: tsParser,
		parserOptions: {
			project: process.env.ESLEGANT_TSCONFIG ?? [
				'./{ts,js}config{.eslint,}.json',
				'./*/{ts,js}config{.eslint,}.json',
				'./*/*/{ts,js}config{.eslint,}.json',
			],
			tsconfigRootDir: process.env.ESLEGANT_ROOT ?? process.cwd(),
		},
	},
	plugins: {
		'@typescript-eslint': tsESLint,
		'import': importPlugin,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		'jsdoc': jsdocPlugin,
		// @ts-expect-error because eslint-plugin-security doesn't export correct types
		'security': securityPlugin,
		// @ts-expect-error because eslint-plugin-unicorn doesn't export correct types
		'unicorn': unicornPlugin,
	},
	settings: {
		'import/extensions': [...tsFiles, ...jsFiles],
		'import/parsers': {
			'@typescript-eslint/parser': [...tsFiles, ...jsFiles ],
		},
		'import/resolver': {
			node: true,
			typescript: true,
		},
		'jsdoc/mode': 'typescript',
	},
};
export default config;
