import type { Linter } from 'eslint';

export type ESConfig = Readonly<Linter.FlatConfig>;

export type inferrableTypesOptions = [
	'never' | 'always' | 'ts-never' | 'js-never',
	{
		/** @see {@link https://typescript-eslint.io/rules/no-inferrable-types#ignoreparameters} */
		parameters?: boolean
		/** @see {@link https://typescript-eslint.io/rules/no-inferrable-types#ignoreproperties} */
		properties?: boolean
		/** @see {@link https://typescript-eslint.io/rules/explicit-function-return-type} */
		returnValues?: boolean
	},
] | 'never' | 'always' | 'ts-never' | 'js-never';

export interface Config {
	tsconfig?: string | string[]
	strict?: boolean
	options?: {
		indent?: 'tab' | 'space'
		quotes?: 'single' | 'double'
		semi?: 'never' | 'always'
		/**
		 * Typescript's type-checking is able to infer types from parameters.
		 * So using an explicit `:` type annotation isn't obligatory.
		 *
		 * But, by default, type annotations are always mandated to make
		 * the core more readable, explicit and robust to changes.
		 *
		 * See {@link https://typescript-eslint.io/rules/no-inferrable-types typescript-eslint documentation }
		 * for more info.
		 * ---
		 * *Note: The JSDocs examples are with invalid {@link https://jsdoc.app/tags-type.html JSDoc (at)type}
		 * syntax unfortunately, as using it would break this documentation display.*
		 * ---
		 * **Option: `never`** (default)
		 * Types are always explicit in Javascript (using JSDocs) and Typescript
		 *
		 * @example ```js
			// Javascript
			//** type {number} *
			const id = 10;
			//** type {string} *
			const name = 'foo';
			```
		 * @example ```ts
			// Typescript
			const id: number = 10;
			const name: string = 'foo';
			```
		 * ---
		 * **Option: `always`**
		 * Types are always inferred in Javascript and Typescript
		 *
		 * @example ```js
			// Javascript
			const id = 10;
			const name = 'foo';
			```
		 * @example ```ts
			// Typescript
			const id = 10;
			const name = 'foo';
			```
		 * ---
		 * **Option: `ts-never`**
		 * Types are always explicit in Typescript, but inferred in Javascript
		 *
		 * @example ```js
			// Javascript
			const id = 10;
			const name = 'foo';
			```
	   * @example ```ts
			// Typescript
			const id: number = 10;
			const name: string = 'foo';
			```
		 * ---
		 * **Option: `js-never`** (default)
		 * Types are always explicit in Javascript (with JSDocs), but inferred in Typescript
		 *
		 * @example ```js
			// Javascript
			//** type {number} *
			const id = 10;
			//** type {string} *
			const name = 'foo';
			```
		 * @example ```ts
			// Typescript
			const id = 10;
			const name = 'foo';
			```
		 * ---
		 */
		inferrableTypes?: inferrableTypesOptions
	}
}
