
export interface Config {
	name: string
	type: 'single' | 'multiple'
	manual?: boolean
	options: {
		name: string
		packages: Record<string, string | string[] | [string, string][]>
		configs?: string[]
		rules?: string[]
		detect?: string[] | true
	}[]
}

export type PackagesConfigsMap = Map<string, Map<string, string[]>>;

export interface Package {
	root?: boolean
	name: string
	path: string
	files: string[]
	directories: string[]
	config?: Record<string, string[]>
}
