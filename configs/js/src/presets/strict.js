/**
 * @file
 * Strict preset object. More info and docs on the type
 * declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const strict = [
	configs.core,
	configs.problems.strict.default,
	configs.suggestions.strict.default,
	configs['suggestions-typescript'].strict.default,
	configs.formatting.strict.default,
	configs.naming.strict.default,
	configs.documentation.recommended.default,
	configs.security.strict.default,
];
export default strict;
