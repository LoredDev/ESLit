import { configs, defineConfig, presets } from '@eslit/config';

export default defineConfig([
	...presets.default,
	configs.environments.node,
]);
