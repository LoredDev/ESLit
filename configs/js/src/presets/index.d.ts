/**
 * @file
 * Types declarations and documentation for the presets object.
 * All these types are public to the user.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import type { Linter } from 'eslint';

const presets: Readonly<{
	/**
	 * @summary
	 * Preset recommended for projects in a prototyping or starting phase.
	 * @description
	 * This preset is mostly recommended for projects in the start of
	 * their development, being more flexible and less opinionated.
	 * Useful for preventing errors.
	 *
	 * Configs used:
	 * - `problems#recommended`;
	 * - `suggestions#recommended`;
	 * - `suggestions-typescript#recommended`;
	 * - `formatting#recommended`;
	 * - `naming#recommended`;
	 * - `documentation#recommended`;
	 *
	 * All configs are set on level `error`.
	 */
	recommended: Linter.FlatConfig[],
	/**
	 * @summary
	 * Preset recommended for projects in a production or large scale.
	 * @description
	 * This preset is more strict and opinionated, focusing on making
	 * your code follow a specific structure and pattern.
	 *
	 * Configs used:
	 * - `problems#strict`;
	 * - `suggestions#strict`;
	 * - `suggestions-typescript#strict`;
	 * - `formatting#strict`;
	 * - `naming#strict`;
	 * - `documentation#recommended`;
	 *
	 * All configs are set on level `error`.
	 */
	strict: Linter.FlatConfig[],
}>;

export default presets;
