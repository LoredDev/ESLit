/**
 * @file Utility functions used in the package to manipulate rules records.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

/**
 * @typedef {import('../configs/index').ConfigVariations} ConfigVariations
 * @typedef {import('eslint').Linter.RuleEntry} RuleEntry
 * @typedef {import('eslint').Linter.RuleLevel} RuleLevel
 * @typedef {import('eslint').Linter.FlatConfig} FlatConfig
 */

/**
 * Changes the level of a rule entry. Checking if it
 * is a Array or a simple RuleLevel entry.
 *
 * Useful in conjunction with {@link iterateRules `iterateRules()`} function.
 *
 * @param {Readonly<RuleEntry>} ruleEntry
 * - The rule entry to be modified.
 * @param {RuleLevel} level
 * - The new level to be passed to the rule.
 * @returns {RuleEntry}
 */
function changeLevel(ruleEntry, level) {
	if (typeof level === 'number') {
		/** @type {RuleLevel[]} */
		const levels = ['error', 'off', 'warn'];
		level = levels[level];
	}

	if (Array.isArray(ruleEntry))
		return [level, ruleEntry[1]];

	return level;

}

/**
 * Iterates through a rule entry record, using the handler
 * on each entry and returns the resulting object.
 *
 * Useful for applying plugin prefixes or changing the rule
 * level of the entries.
 *
 * @param {Readonly<{[name: string]: RuleEntry}>} rules
 * - The object to be iterated through.
 * @param {([name, entry]: [string, RuleEntry]) => [string, RuleEntry]} handler
 * - Function to run on every rule entry.
 * @returns {{[name: string]: RuleEntry}} - The resulting object.
 */
function iterateRules(rules, handler) {
	const entries = Object.entries(rules);
	entries.map(entry => handler(entry));
	return Object.fromEntries(entries);
}

/**
 * Creates {@link ConfigVariations variations} for the given configuration object.
 * With `error`, `warn` and `off` rule levels.
 *
 * Used in the configuration objects of this package.
 *
 * @param {Readonly<FlatConfig>} config
 * - The configuration object to create `error`, `warn`, and `off` variations.
 * @returns {ConfigVariations}
 */
function createVariations(config) {
	const configError = {
		...config,
		rules: iterateRules(config.rules ?? {}, ([key, entry]) =>
			(entry === 'off' || (Array.isArray(entry) && entry[0] === 'off')
				? [key, entry]
				: [key, changeLevel(entry, 'error')]),
		),
	};

	const configWarning = {
		...config,
		rules: iterateRules(config.rules ?? {}, ([key, entry]) =>
			(entry === 'off' || (Array.isArray(entry) && entry[0] === 'off')
				? [key, entry]
				: [key, changeLevel(entry, 'warn')]),
		),
	};

	const configDisabled = {
		...config,
		rules: iterateRules(
			config.rules ?? {},
			([key, entry]) => [key, changeLevel(entry, 'off')],
		),
	};

	return {
		default: config,
		error: configError,
		off: configDisabled,
		warn: configWarning,
	};
}

export { createVariations, iterateRules };
