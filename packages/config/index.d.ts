import type { EnvOptions } from './src/types';
import type { Linter } from 'eslint';

export async function defineConfig(eslintConfig: Linter.FlatConfig[], environment: EnvOptions): Promise<Linter.FlatConfig[]>;
