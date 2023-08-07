
/** @type {import('./types').Config[]} */
export default [
	{
		name: 'framework',
		type: 'multiple',
		description: 'The UI frameworks being used in the project',
		options: [
			{
				name: 'svelte',
				packages: { '@eslit/svelte': 'svelte' },
				configs: ['svelte.recommended'],
				detect: ['**/*.svelte', 'svelte.config.{js,ts,cjs,cts}'],
			},
			{
				name: 'vue',
				packages: { '@eslit/vue': ['vue', ['hello', 'world']], '@eslit/svelte': ['hello'] },
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
			packages: { '@eslit/config': 'config', '@eslit/vue': ['test1'] },
			configs: ['config.strict'],
		}],
	},
];
