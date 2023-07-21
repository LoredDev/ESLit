import type { Config } from './types';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			READABLE_ESLINT_STRICT: Config['strict']
			READABLE_ESLINT_OPTIONS: Config['options']
		}
	}
}

export {};
