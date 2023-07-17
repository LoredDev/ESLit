import { defineConfig } from 'readable';

export default defineConfig({
	tsconfig: ['./tsconfig.json', './packages/*/tsconfig.json', './packages/*/jsconfig.json'],
	environment: {
		node: true,
	},
});
