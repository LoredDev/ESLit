
export interface Config {
	name: string
	type: 'single' | 'multiple'
	manual?: boolean
	options: {
		name: string
		packages: Record<string, string | string[] | [string, string][]>
		rules: string[]
		detect?: string[] | true
	}[]
}

export interface Workspace {
	packages: Package[]
}

export interface Package {
	name: string
	path: string
	files: string[]
	directories: string[]
	config?: Record<string, string[]>
}
