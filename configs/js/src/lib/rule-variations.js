
/**
 * @typedef {import('eslint').Linter.RuleEntry} RuleEntry
 * @typedef {import('eslint').Linter.RuleLevel} RuleLevel
 * @typedef {import('eslint').Linter.FlatConfig} FlatConfig
 */

/**
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
 * @param {Readonly<FlatConfig>} config
 * - The configuration object to create `error`, `warn`, and `off` variations.
 * @returns {{error: FlatConfig, warn: FlatConfig, off: FlatConfig}}
 */
function createVariations(config) {
	const configError = {
		...config,
		rules: iterateRules(
			config.rules ?? {},
			([key, entry]) => [key, changeLevel(entry, 'error')],
		),
	};

	const configWarning = {
		...config,
		rules: iterateRules(
			config.rules ?? {},
			([key, entry]) => [key, changeLevel(entry, 'warn')],
		),
	};

	const configDisabled = {
		...config,
		rules: iterateRules(
			config.rules ?? {},
			([key, entry]) => [key, changeLevel(entry, 'off')],
		),
	};

	return { error: configError, off: configDisabled, warn: configWarning };
}

export { createVariations, iterateRules };
