/**
 * @file
 * Type declaration for the `globals` package in a attempt to make it
 * compatible with the new flat config.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

declare module 'globals' {
	const globals: {
		browser: { [rule: string]: boolean, },
		builtin: { [rule: string]: boolean, },
		commonjs: { [rule: string]: boolean, },
		node: { [rule: string]: boolean, },
		nodeBuiltin: { [rule: string]: boolean, },
	};
	export default globals;
}
