import type { FlatCompat } from '@eslint/eslintrc';
import type { Linter } from 'eslint';

type MaybePromise<T> = Promise<T> | T;
export type Config = Linter.FlatConfig[] | ((eslintrc: FlatCompat) => MaybePromise<Linter.FlatConfig[]>);

export interface EnvOptions {
	ESLIT_TSCONFIG?: string | string[] | true
	ESLIT_ROOT?: string
	ESLIT_INDENT?: 'tab' | 'space' | number
	ESLIT_ECMASCRIPT?: Linter.ParserOptions['ecmaVersion']
	ESLIT_QUOTES?: 'single' | 'double'
	ESLIT_SEMI?: 'never' | 'always'
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
	 * @example ```ts
			// Typescript
			const id: number = 10;
			const name: string = 'foo';
			```
	 * ---
	 * **Option: `always`**
	 * Types are always inferred in Typescript
	 * @example ```ts
			// Typescript
			const id = 10;
			const name = 'foo';
			```
	 */
	ESLIT_INFER_TYPES?: inferrableTypesOptions
	[ENV: string]: unknown
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
