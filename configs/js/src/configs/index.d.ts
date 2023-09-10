/**
 * @file
 * Type declarations and documentations for all configs objects.
 * All these types are public to the user.
 * @license MIT
 * @author Guz013 <contact.guz013@gmail.com> (https://guz.one)
 */

import type { Linter } from 'eslint';

interface ConfigVariations {
	/**
	 * @summary
	 * Enable rules with the predefined levels of the package.
	 * @description
	 * Most of the rules in ESLegant are on `error` level. This
	 * was preferred so it is harder to ignore them. But it has
	 * some small exceptions where rules will be at `warn` level,
	 * being more as a "reminder" than a actual rule.
	 *
	 * If you want to **every** rule in the config to have an
	 * `error` or `warn` level, you can use the other variants.
	 */
	default: Linter.FlatConfig,
	/**
	 * @description
	 * Enable all rules with `error` level.
	 */
	error: Linter.FlatConfig,
	/**
	 * @description
	 * Disable all rules in this config.
	 */
	off: Linter.FlatConfig,
	/**
	 * @description
	 * Enable all rules with `warn` level.
	 */
	warn: Linter.FlatConfig,
}

const configs: Readonly<{
	/**
	 * @summary
	 * **Add this configuration at the start of your array**.
	 * @description
	 * This config adds necessary plugins and configuration for ESLint
	 * to use in the other configs **This should always be in the top
	 * of the configuration array**.
	 */
	core: Linter.FlatConfig,
	/**
	 * @description
	 * This configuration helps you document your code with JSDoc.
	 */
	documentation: {
		/**
		 * @summary
		 * Recommended rules from the original plugins.
		 * @description
		 * Less strict rules, that nots enforces documentation on
		 * every aspect/function of your code. Recommended rules for
		 * projects in prototyping or starting phases, or apps that
		 * doesn't needs massive documentations.
		 */
		recommended: ConfigVariations,
		/**
		 * @summary
		 * More opinionated configuration, created for ESLegant and Lored's projects.
		 * @borrows Builds on top of the recommended configuration
		 * @description
		 * Enforces some documentation of every function and file.
		 * Better for libraries (in more production-ready phases),
		 * large codebase's and/or projects with multiple teams/people.
		 */
		strict: ConfigVariations,
	},
	/**
	 * @summary
	 * Configurations related to specific JavaScript/TypeScript environments,
	 * such as Node, Deno and the Browser.
	 * @description
	 * Adds global variables and rules related to code on said environments.
	 * **They can and should be combined** depending on the codebase you're
	 * working with.
	 */
	environments: {
		/**
		 * @summary
		 * Browser environment configuration, use this if you are working
		 * on a pure client-side or mixed codebase environment.
		 * @description
		 * Warns about possible incompatible Web APIs on your codebase, you can
		 * configure the target browsers using {@link https://github.com/browserslist/browserslist browserslist}
		 * on `package.json`.
		 */
		browser: {
			/**
			 * @description
			 * Recommends end enforces the use of newer web APIs
			 * on your codebase.
			 */
			recommended: ConfigVariations,
			/**
			 * @borrows Builds on top of the recommended configuration
			 * @todo
			 * For now, the strict rules is a alias of the recommended,
			 * as it not currently adds any new rules.
			 */
			strict: ConfigVariations,
		},
		node: {
			/**
			 * @summary
			 * Configuration overrides for CommonJS files.
			 * @description
			 * ESLegant recommends the use of ESModules and newer syntax
			 * for javascript files. This configuration should mostly be
			 * used for exceptions, like config files that don't support
			 * ESM.
			 *
			 * This configuration just affects files ending in `*.cjs`
			 * and `*.cts` extensions. If you want to use in other files
			 * consider creating a config object.
			 * @example <caption>Example of using the config for specific CommonJS files</caption>
			 * import { configs } from '@eslegant/js';
			 *
			 * export default [
			 *   {
			 *      ...configs.environments.node.commonjs.error
			 *	    files: ['*.config.js'],
			 *   }
			 * ]
			 */
			commonjs: ConfigVariations,
			/**
			 * @description
			 * Recommends newer and best practices on NodeJS projects.
			 */
			recommended: ConfigVariations,
			/**
			 * @borrows Builds on top of the recommended configuration
			 * @todo
			 * For now, the strict rules is a alias of the recommended,
			 * as it not currently adds any new rules.
			 */
			strict: ConfigVariations,
		},
	},
	/**
	 * @summary
	 * This config relates to code formatting and style in JavaScript and TypeScript.
	 * @description
	 * This configuration enforces a specific code formatting and style in JavaScript
	 * and TypeScript. The purpose of it can sometimes overlap with the `suggestions`
	 * config, so to separate better, this tries to mostly enforces just rules for
	 * how the code looks and is organized than coding style/way of handling something.
	 */
	formatting: {
		/**
		 * @summary
		 * ESLegant / Lored's code style configuration.
		 * @description
		 * This configuration recommends a opinionated code and formatting style, which
		 * is mostly similar to other styles in the JavaScript environment.
		 * It is based on the work and config of Anthony's ESLint config (`antfu/eslint-config`),
		 * with the most notable changes being the use of `tabs` instead of 2 space indentation
		 * and the use of semicolons.
		 * @see {@link https://github.com/antfu/eslint-config Anthony's config}
		 */
		recommended: ConfigVariations,
		/**
		 * @borrows Builds on top of the recommended configuration
		 * @todo
		 * For now, the strict rules is a alias of the recommended,
		 * as it not currently adds any new rules.
		 */
		strict: ConfigVariations,
	},
	/**
	 * @description
	 * This configuration enforces a specific naming convention for the codebase.
	 * With the object of making the code more readable and understandable.
	 */
	naming: {
		/**
		 * @summary
		 * Prevents bad naming conventions and behavior.
		 * @description
		 * This configuration prevents bad names and behaviors such as abbreviations.
		 * It does not enforces specific names or naming structure/strategies.
		 * **With the exception of** file names being enforces to be `kebab-case`.
		 */
		recommended: ConfigVariations,
		/**
		 * @summary
		 * Enforces specific naming structure/strategies.
		 * @borrows Builds on top of the recommended configuration
		 * @description
		 * This configuration enforces specific names or naming structure/strategies for your
		 * code. Enforcing things such using verbs and nouns in specif orders and
		 * when abbreviations are accepted or not.
		 */
		strict: ConfigVariations,
	},
	overrides: {
		'inferrable-types': ConfigVariations,
		performance: ConfigVariations,
	},
	/**
	 * @summary
	 * Prevents possible syntax errors in your code.
	 * @description
	 * This configuration object prevents possible syntax and code logic
	 * errors on your file. Mostly not opinionated.
	 */
	problems: {
		/**
		 * @description
		 * Rules which prevents most errors in your code. Based
		 * mostly on ESLint's recommended configuration.
		 */
		recommended: ConfigVariations,
		/**
		 * @borrows Builds on top of the recommended configuration
		 * @description
		 * Extra-safety rules, reporting possible forgettable errors
		 * or errors in typing.
		 */
		strict: ConfigVariations,
	},
	/**
	 * @summary
	 * Prevents possible vulnerabilities.
	 * @description
	 * This configuration tries to prevent possible vulnerabilities
	 * in you code, such as hard-coded secrets, personal information in comments,
	 * XSS attacks, etc.
	 */
	security: {
		/**
		 * @description
		 * Rules which warns you about possible security vulnerabilities.
		 */
		recommended: ConfigVariations,
		/**
		 * @borrows Builds on top of the recommended configuration
		 * @description
		 * Similar to recommended config, but with rules in error-level
		 * to make possible vulnerabilities harder to ignore.
		 */
		strict: ConfigVariations,
	},
	/**
	 * @summary
	 * Enforces different ways of coding in JavaScript and TypeScript.
	 * @description
	 * This configuration enforces different ways doing things, coding style and/or
	 * code logic patterns. Preferring over explicit and declarative code than
	 * implicit.
	 */
	suggestions: {
		/**
		 * @summary
		 * Recommended for projects in prototyping/starting phases.
		 * @description
		 * This configuration enforces mostly best practices,
		 * based on the `recommended` options of the plugins.
		 */
		recommended: ConfigVariations,
		/**
		 * @summary
		 * Strict rules that takes "guarding rails" for your code.
		 * @borrows Builds on top of the recommended configuration
		 * @description
		 * **This will get in the way of your programming**. This configuration
		 * tries prevent possible bad code smells and practices that could built
		 * up when your project grows. Enforcing you to refactor more the code
		 * and separating and or reorganizing functions and code logic.
		 * @see {@link https://youtu.be/CFRhGnuXG-4 Example: Why You Shouldn't Nest Your Code - by: CodeAesthetic}
		 * - The maximum depth allowed is 4. (`max-depth: [error, 4]`)
		 * @see {@link https://youtu.be/J1f5b4vcxCQ Example: Dependency Injection, The Best Pattern - by: CodeAesthetic}
		 * - Files should be organized in a tree-like structure, and shouldn't import modules
		 * in parent directories. This helps you organize your code and suggests using
		 * dependency injection more.
		 */
		strict: ConfigVariations,
	},
	/**
	 * @summary
	 * Rules for TypeScript files specifically. **Use this if
	 * you have Typescript files in your project**.
	 * Affects `*.ts`, `*.tsx`, `*.mts` and `*.cts` files.
	 * @description
	 * Most of TypeScript rules can be applied to type-checked JavaScript
	 * files also. But some can just be fixed in TypeScript syntax, so they
	 * where disabled and moved to this specific configuration.
	 *
	 * It also disable things that aren't useful when using TypeScript, such
	 * as types in JSDoc comments.
	 *
	 * **This should be placed after the `suggestion` config.**.
	 *
	 */
	'suggestions-typescript': {
		/**
		 * @summary
		 * Rules similar to {@link configs.suggestions.recommended `suggestions#recommended`},
		 * but for TypeScript.
		 */
		recommended: ConfigVariations,
		/**
		 * @summary
		 * Rules similar to {@link configs.suggestions.strict `suggestions#strict`},
		 * but for TypeScript.
		 */
		strict: ConfigVariations,
	},
}>;

export default configs;
export type { ConfigVariations };
