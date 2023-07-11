import type { Linter } from "eslint"

export type ESConfig = Readonly<Linter.FlatConfig>;

export interface Config {
	tsconfig?: string | string[];
	indent?: 'tab' | 'space';
	strict?: boolean;
}
