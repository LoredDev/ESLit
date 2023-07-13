import type { Linter } from 'eslint';

export type ESConfig = Readonly<Linter.FlatConfig>;

export interface Config {
	tsconfig?: string | string[]
	strict?: boolean
	options?: {
		indent?: 'tab' | 'space'
		quotes?: 'single' | 'double'
		semi?: 'never' | 'always'
	}
}
