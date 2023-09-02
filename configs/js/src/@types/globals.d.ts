declare module 'globals' {
	const globals: {
		browser: { [rule: string]: boolean }
		builtin: { [rule: string]: boolean }
		commonjs: { [rule: string]: boolean }
		node: { [rule: string]: boolean }
		nodeBuiltin: { [rule: string]: boolean }
	};
	export default globals;
}
