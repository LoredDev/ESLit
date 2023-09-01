declare module 'globals' {
	const globals: {
		browser: Record<string, boolean>
		builtin: Record<string, boolean>
		commonjs: Record<string, boolean>
		node: Record<string, boolean>
		nodeBuiltin: Record<string, boolean>
	};
	export default globals;
}
