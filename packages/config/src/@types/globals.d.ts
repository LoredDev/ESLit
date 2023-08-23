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
