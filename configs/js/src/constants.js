/**
 * @file
 * Constant values used around the package.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

const JS_FILES = [
	'**/*.js',
	'**/*.mjs',
	'**/*.cjs',
	'**/*.jsx',
];
const TS_FILES = [
	'**/*.ts',
	'**/*.mts',
	'**/*.cts',
	'**/*.tsx',
];
const FILES = [
	JS_FILES,
	TS_FILES,
].flat();

export {
	FILES,
	JS_FILES,
	TS_FILES,
};
