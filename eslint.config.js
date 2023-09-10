import { configs, defineConfig, presets } from '@eslegant/js';

export default defineConfig([
	...presets.strict,
	configs.environments.node.strict.default,
	{
		...configs.documentation.strict.error,
		files: ['configs/**/*.js', 'configs/**/*.ts'],
	},
	{
		files: ['**/*.{js,ts,cjs,tjs,mjs,mts,jsx,tsx}'],
		rules: {
			'jsdoc/check-values': ['error', { allowedLicenses: ['MIT'] }],
		},
	},
]);
