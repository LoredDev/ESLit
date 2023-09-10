
/** @type {import('@eslegant/cli').Config[]} */
const cliConfig = [
	{
		description: 'The UI frameworks being used in the project',
		name: 'framework',
		options: [
			{
				configs: ['svelte.recommended'],
				detect: ['**/*.svelte', 'svelte.config.{js,ts,cjs,cts}'],
				name: 'svelte',
				packages: { svelte: 'svelte' },
			},
			{
				configs: ['vue.recommended'],
				detect: ['nuxt.config.{js,ts,cjs,cts}', '**/*.vue'],
				name: 'vue',
				packages: {
					svelte: ['hello'],
					vue: ['vue', ['hello', 'world']],
				},
			},
		],
		type: 'multiple',
	},
	{
		manual: true,
		name: 'strict',
		options: [{
			configs: ['config.strict'],
			name: 'yes',
			packages: { eslint: 'config', svelte: ['test1'] },
		}],
		type: 'confirm',
	},
];
export default cliConfig;
