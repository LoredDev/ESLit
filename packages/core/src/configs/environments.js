import globals from 'globals';

/**
 * @param {import('../types').Config['environment']} environment
 * Manual configuration of environments, if undefined,
 * the function tries to detect the environment automatically
 * @returns {import('../types').ESConfig[]}
 * ESLint configuration with global variables and environment
 */
export function environments(environment) {

	environment ||= {
		node:
			typeof window === 'undefined' &&
			typeof process !== 'undefined' &&
			typeof require !== 'function',
		deno:
			typeof window !== 'undefined' &&
			// @ts-expect-error because this package is develop in node
			typeof Deno !== 'undefined',
		browser:
			typeof window !== 'undefined',
	};

	return [
		{
			files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.cts', '**/*.mts'],
			languageOptions: {
				ecmaVersion: environment.ecmaVersion ?? 'latest',
				globals: {
					...globals.builtin,
					...environment.customGlobals,
				},
			},
		},
		{
			files: ['**/*.cjs', '**/*.cts'],
			languageOptions: {
				sourceType: 'commonjs',
				globals: {
					...globals.node,
					...globals.commonjs,
				},
			},
		},
		{
			files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.mts'],
			languageOptions: {
				sourceType: 'module',
				globals: {
					...(environment.node ? globals.nodeBuiltin : {}),
					...(environment.browser || environment.deno ? globals.browser : {}),
					...(environment.deno ? { Deno: true } : {}),
				},
			},
		},
	];
}
