import type { OptionValues } from 'commander';

export type CliArgs = {
	packages?: string[]
	mergeToRoot?: boolean
	dir: string
} & OptionValues;

export type Config = {
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

export interface Package {
	root?: boolean
	name: string
	path: string
	files: string[]
	directories: string[]
	config?: Map<string, string[]>
	configFile?: ConfigFile
}

export interface ConfigFile {
	path: string
	imports: Map<string, string | (string | [string, string])[]>
	configs: string[]
	presets: string[]
	rules: string[]
}
