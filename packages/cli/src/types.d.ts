import type { OptionValues } from 'commander';

type PackageManagerName = 'bun' | 'deno' | 'npm' | 'pnpm' | 'yarn';

interface PackageManagerHandler {
	install(path: string, packages: string[]): Promise<void> | void,
}

type Config = {
	description?: string,
	manual: true,
	name: string,
	options: [{
		configs?: string[],
		detect?: undefined,
		name: 'yes',
		packages?: { [key: string]: ([string, string] | string)[] | string, },
		presets?: string[],
		rules?: string[],
	}],
	type: 'confirm',
} | {
	description?: string,
	manual?: boolean,
	name: string,
	options: {
		configs?: string[],
		detect?: string[] | true,
		name: string,
		packages?: { [key: string]: ([string, string] | string)[] | string, },
		presets?: string[],
		rules?: string[],
	}[],
	type: 'multiple' | 'single',
};

type CliArgs = {
	configs: Config[],
	dir: string,
	installPkgs?: PackageManagerName | boolean,
	mergeToRoot?: boolean,
	packages?: string[],
} & OptionValues;

interface ConfigFile {
	configs: string[],
	content?: string,
	imports: Map<string, ([string, string] | string)[] | string>,
	path: string,
	presets: string[],
	rules: string[],
}

interface Package {
	config?: Map<string, string[]>,
	configFile?: ConfigFile,
	directories: string[],
	files: string[],
	name: string,
	path: string,
	root?: boolean,
}


export type {
	CliArgs,
	Config,
	ConfigFile,
	Package,
	PackageManagerHandler,
	PackageManagerName,
};
