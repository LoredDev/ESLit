import type { OptionValues } from 'commander';

type PackageManagerName = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno';

type CliArgs = {
	packages?: string[]
	mergeToRoot?: boolean
	installPkgs?: boolean | PackageManagerName
	dir: string
	configs: Config[]
} & OptionValues;

interface PackageManagerHandler {
	install(path: string, packages: string[]): Promise<void> | void
}

type Config = {
	name: string
	type: 'single' | 'multiple'
	manual?: boolean
	description?: string
	options: {
		name: string
		packages?: Record<string, string | (string | [string, string])[]>
		configs?: string[]
		rules?: string[]
		presets?: string[]
		detect?: string[] | true
	}[]
} | {
	name: string
	type: 'confirm'
	manual: true
	description?: string
	options: [{
		name: 'yes'
		packages?: Record<string, string | (string | [string, string])[]>
		configs?: string[]
		rules?: string[]
		presets?: string[]
		detect?: undefined
	}]
};

interface Package {
	root?: boolean
	name: string
	path: string
	files: string[]
	directories: string[]
	config?: Map<string, string[]>
	configFile?: ConfigFile
}

interface ConfigFile {
	path: string
	imports: Map<string, string | (string | [string, string])[]>
	configs: string[]
	presets: string[]
	rules: string[]
	content?: string
}

export type { PackageManagerName, PackageManagerHandler, CliArgs, Config, Package, ConfigFile };
