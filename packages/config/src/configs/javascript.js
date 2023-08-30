import coreConfig from './core.js';
import tsESLint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-i';
import jsdocPlugin from 'eslint-plugin-jsdoc';

/** @type {import('eslint').Linter.FlatConfig}*/
const recommended = {
	...coreConfig,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	rules: {
		...js.configs.recommended.rules,
		...tsESLint.configs.recommended.rules,
		...tsESLint.configs['recommended-requiring-type-checking'].rules,
		...tsESLint.configs['eslint-recommended'].rules,
		...tsESLint.configs.strict.rules,
		...importPlugin.configs['recommended'].rules,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		...jsdocPlugin.configs['recommended-typescript-flavor-error'].rules,
	},
};

/** @type {import('eslint').Linter.FlatConfig}*/
const strict = {
	...recommended,
};
const javascript = { recommended, strict };
export default javascript;
