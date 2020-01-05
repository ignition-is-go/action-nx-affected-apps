import { execSync } from 'child_process'

export function getNxAffectedApps({ base, head, workspace }: Props): string[] {
	const args = `${base ? `--base=${base}` : ''} ${
		head ? `--head=${head}` : ''
		}`
	let result
	try {

		result = execSync(
			`nx affected:apps ${args}`,
			{ cwd: workspace }
		).toString()
	} catch {
		try {

			result = execSync(
				`./node_modules/.bin/nx affected:apps ${args}`,
				{ cwd: workspace }
			).toString()
		} catch {
			result = execSync(
				`npm run nx -- affected:apps ${args}`,
				{ cwd: workspace }
			).toString()
		}
	}

	if (!result) {
		throw Error('Could not run NX cli...Did you install it globally and in your project? Also, try adding this npm script: "nx":"nx"')
	}

	if (!result.includes('Affected apps:')) {
		throw Error(`NX Command Failed: ${result}`)
	}

	const apps = result
		.split('Affected apps:')[1]
		.trim()
		.split('- ')
		.map(x => x.trim())
		.filter(x => x.length > 0)

	return apps || []
}

interface Props {
	base?: string
	head?: string
	workspace: string
}
