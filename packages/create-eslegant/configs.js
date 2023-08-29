
/** @type {import('@eslit/cli').Config[]} */
const cliConfig = [
	{
		name: 'framework',
		type: 'multiple',
		description: 'The UI frameworks being used in the project',
		options: [
			{
				name: 'svelte',
				packages: { 'svelte': 'svelte' },
				configs: ['svelte.recommended'],
				detect: ['**/*.svelte', 'svelte.config.{js,ts,cjs,cts}'],
			},
			{
				name: 'vue',
				packages: { 'vue': ['vue', ['hello', 'world']], 'svelte': ['hello'] },
				configs: ['vue.recommended'],
				detect: ['nuxt.config.{js,ts,cjs,cts}', '**/*.vue'],
			},
		],
	},
	{
		name: 'strict',
		type: 'confirm',
		manual: true,
		options: [{
			name: 'yes',
			packages: { 'eslint': 'config', 'svelte': ['test1'] },
			configs: ['config.strict'],
		}],
	},
];
export default cliConfig;
