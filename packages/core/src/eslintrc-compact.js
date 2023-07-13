// @ts-expect-error This package doesn't export types
import { FlatCompat } from '@eslint/eslintrc';
import javascript from '@eslint/js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const eslintrc = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: javascript.configs.recommended,
	allConfig: javascript.configs.all,
});
