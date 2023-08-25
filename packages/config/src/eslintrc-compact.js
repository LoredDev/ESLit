import { FlatCompat } from '@eslint/eslintrc';
import javascript from '@eslint/js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eslintrc = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: javascript.configs.recommended,
	allConfig: javascript.configs.all,
});

export { eslintrc, __filename, __dirname };
