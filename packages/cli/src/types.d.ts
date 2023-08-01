
interface Options {
	environment: {
		node: boolean
		deno: boolean
		browser: boolean
	}
}

export interface Workspace {
	packages: Package[]
}

export interface Package {
	name: string
	files: string[]
	directories: string[]
}
