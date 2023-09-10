/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable unicorn/no-useless-spread */
/**
 * @file
 * Configuration objects for the NodeJS environment.
 * See more info on the configs type declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';

import { createVariations } from '../../lib/rule-variations.js';
import { FILES } from '../../constants.js';

const commonjs = createVariations({
	files: ['**/*.cts', '**/*.cjs'],
	languageOptions: {
		globals: {
			...globals.nodeBuiltin,
			...globals.commonjs,
		},
	},
	plugins: {
		// @ts-expect-error because types are not defined in 'eslint-plugin-n'
		n: nodePlugin,
	},
	rules: {
		...{}, // Plugin: @typescript-eslint/eslint-plugin
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-var-requires': 'off',

		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-module': 'off',

		...{}, // Plugin: eslint-plugin-import
		'import/no-commonjs': 'off',

		...{}, // Plugin: eslint-plugin-n
		'n/global-require': 'error',
		'n/no-exports-assign': 'error',

		...{}, // Plugin: eslint-plugin-security
		'security/detect-non-literal-require': 'error',
	},
});

const recommended = createVariations({
	files: FILES,
	languageOptions: {
		globals: {
			...globals.nodeBuiltin,
		},
	},
	plugins: {
		// @ts-expect-error because types are not defined in 'eslint-plugin-n'
		n: nodePlugin,
	},
	rules: {
		...{}, // Plugin: eslint-plugin-unicorn
		'unicorn/prefer-node-protocol': 'error',

		...{}, // Plugin: eslint-plugin-import
		'import/no-dynamic-require': 'error',

		...{}, // Plugin: eslint-plugin-n
		'n/no-deprecated-api': 'error',
		'n/no-process-exit': 'error',
		'n/no-unpublished-bin': 'error',
		'n/no-unpublished-import': 'error',
		'n/no-unpublished-require': 'error',
		'n/no-unsupported-features/es-builtins': 'error',
		'n/no-unsupported-features/es-syntax': 'error',
		'n/no-unsupported-features/node-builtins': 'error',
		'n/process-exit-as-throw': 'error',
		'n/shebang': 'error',

		...{}, // Plugin: eslint-plugin-security
		'security/detect-buffer-noassert': 'warn',
		'security/detect-child-process': 'warn',
		'security/detect-new-buffer': 'warn',
		'security/detect-no-csrf-before-method-override': 'warn',
		'security/detect-non-literal-fs-filename': 'warn',
	},
});

const strict = createVariations({
	...recommended.error,
	rules: {
		...recommended.error.rules,

		...{}, // Plugin: eslint-plugin-n
		'n/no-new-require': 'error',
		'n/no-path-concat': 'error',
		'n/prefer-global/buffer': ['error', 'never'],
		'n/prefer-global/console': ['error', 'always'],
		'n/prefer-global/process': ['error', 'never'],
		'n/prefer-global/text-decoder': ['error', 'always'],
		'n/prefer-global/text-encoder': ['error', 'always'],
		'n/prefer-global/url': ['error', 'always'],
		'n/prefer-global/url-search-params': ['error', 'always'],
		'n/prefer-promises/dns': 'error',
		'n/prefer-promises/fs': 'error',

		...{}, // Plugin: eslint-plugin-security
		'security/detect-buffer-noassert': 'error',
		'security/detect-child-process': 'error',
		'security/detect-new-buffer': 'error',
		'security/detect-no-csrf-before-method-override': 'error',
		'security/detect-non-literal-fs-filename': 'warn',
	},
});

const node = { commonjs, recommended, strict };
export default node;
