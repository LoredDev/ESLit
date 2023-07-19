import type { FlatCompat } from '@eslint/eslintrc';
import type { Linter } from 'eslint';

export type ESConfig = Readonly<Linter.FlatConfig>;

export interface Config {
	tsconfig?: string | string[] | true
	strict?: boolean
	rootDir?: string
	/**
	 * @summary
	 * Environment and language settings
	 *
	 * If no globals/environments are defined, the configuration tries to detect the
	 * environment using `typeof`. See each option for more explanation
	 */
	environment?: {
		/**
		 * @summary
		 * Enables NodeJS environment globals.
		 *
		 * **Note:** this does not enables CommonJS globals, if you are using
		 * CommonJS, use a file ending in `.cjs` or `.cts`
		 *
		 * @example // Detects if
		 * typeof window === 'undefined' &&
		 * typeof process !== 'undefined' &&
		 * typeof require !== 'undefined'
		 */
		node?: boolean
		/**
		 * @summary
		 * Enables the global `Deno` namespace and browser/web standards globals
		 *
		 * @example // Detects if
		 * typeof window !== 'undefined' &&
		 * typeof Deno !== 'undefined'
		 */
		deno?: boolean
		/**
		 * @summary
		 * Enables browser/web standards globals
		 *
		 * @example // Detects if
		 * typeof window !== 'undefined'
		 */
		browser?: boolean
		/**
		 * @summary
		 * What JavaScript (ECMAScript) that will be evaluated
		 *
		 * **Defaults to `latest`**
		 */
		ecmaVersion?: Linter.ParserOptions['ecmaVersion']
		/**
		 * @summary
		 * User defined globals for edge-cases or if available aren't enough
		 *
		 * **Does not overrides previous enabled ones**
		 */
		customGlobals?: Record<string, boolean>
	}
	options?: {
		indent?: 'tab' | 'space'
		quotes?: 'single' | 'double'
		semi?: 'never' | 'always'
		/**
		 * Typescript's type-checking is able to infer types from parameters.
		 * So using an explicit `:` type annotation isn't obligatory.
		 *
		 * But, **by default in strict mode**, type annotations are always mandated to make
		 * the code more readable, explicit and robust to changes.
		 *
		 * See {@link https://typescript-eslint.io/rules/no-inferrable-types typescript-eslint documentation }
		 * for more info.
		 * ---
		 * **Option: `never`** (default)
		 * Types are always explicit in Typescript
		 *
		 * @example ```ts
			// Typescript
			const id: number = 10;
			const name: string = 'foo';
			```
		 * ---
		 * **Option: `always`**
		 * Types are always inferred in Typescript
		 *
		 * @example ```ts
			// Typescript
			const id = 10;
			const name = 'foo';
			```
		 */
		inferrableTypes?: inferrableTypesOptions
	}
	overrides?:
	| Linter.FlatConfig[]
	| ((eslintrc: FlatCompat) => Linter.FlatConfig[] | Promise<Linter.FlatConfig[]>)
}

export type inferrableTypesOptions = [
	'never' | 'always',
	{
		/** @see {@link https://typescript-eslint.io/rules/no-inferrable-types#ignoreparameters} */
		parameters?: boolean
		/** @see {@link https://typescript-eslint.io/rules/no-inferrable-types#ignoreproperties} */
		properties?: boolean
		/** @see {@link https://typescript-eslint.io/rules/explicit-function-return-type} */
		returnValues?: boolean
	},
] | 'never' | 'always';
