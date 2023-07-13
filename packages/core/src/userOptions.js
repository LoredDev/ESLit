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
		},
		{
			files: ['**/*.ts'],
			rules: {
				...(
					/** @type {() => import('eslint').Linter.RulesRecord} */
					() => {

						const inferrableTypes = userOptions?.inferrableTypes ?? 'never';

						if (typeof inferrableTypes === 'string') {
							return {
								'@typescript-eslint/explicit-function-return-type': inferrableTypes === 'always' ? 'off' : 'error',
								'@typescript-eslint/no-inferrable-types': inferrableTypes === 'always' ? 'off' : 'error',
							};
						}
						else {
							return {
								'@typescript-eslint/explicit-function-return-type': inferrableTypes[1].returnValues ? 'off' : 'error',
								'@typescript-eslint/no-inferrable-types': [
									inferrableTypes[0] === 'always' ? 'off' : 'error',
									{
										ignoreParameters: inferrableTypes[1].parameters ?? false,
										ignoreProperties: inferrableTypes[1].properties ?? false,
									},
								],
							};
						}
					})(),
			},
		}];
}
