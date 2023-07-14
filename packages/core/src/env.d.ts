/**
 * @see {@link https://github.com/sindresorhus/globals}
 * @summary Global identifiers from different Javascript environments
 * ---
 * **Note:**
 *
 * The `globals` package type declarations doesn't seems to be working properly,
 * so the used globals are declared here so the type-checking doesn't error.
 *
 * Also, because of this manual declaration, we can filter just the globals that
 * are recommended/should be used in normal development/environments today.
 */
declare module 'globals' {
	const globals: {
		builtin: Record<string, boolean>
		browser: Record<string, boolean>
		node: Record<string, boolean>
		nodeBuiltin: Record<string, boolean>
		commonjs: Record<string, boolean>
	};
	export default globals;
}
