import * as configs from './configs/index.js';

/**
 * @param {import('./types').Config['options']} userOptions
 * @returns {import('./types').ESConfig[]}
 */
export function getUserRules(userOptions) {
	return [
		{
			files: ['**/*.js', '**/*.ts'],
			rules: {
				'@typescript-eslint/semi': ['error', userOptions?.semi ?? 'always'],
				'@typescript-eslint/quotes': ['error', userOptions?.quotes ?? 'single'],
				'@typescript-eslint/indent': ['error', userOptions?.indent === 'space' ? 2 : 'tab',
					// @ts-expect-error because this rule type can be without options
					configs.formatting.rules['@typescript-eslint/indent'][2] ?? null,
				],
			},
		}];
}
