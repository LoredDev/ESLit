/**
 * @file
 * Recommended preset object. More info and docs on the type
 * declaration file.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

// eslint-disable-next-line import/no-relative-parent-imports
import configs from '../configs/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const recommended = [
	configs.core,
	configs.problems.recommended.error,
	configs.suggestions.recommended.error,
	configs['suggestions-typescript'].recommended.error,
	configs.formatting.recommended.error,
	configs.naming.recommended.error,
	configs.documentation.recommended.error,
];
export default recommended;
