import { configs, defineConfig, presets } from '@eslegant/config';

export default defineConfig([
	...presets.default,
	configs.environments.node,
]);
