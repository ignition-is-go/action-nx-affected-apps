import {execSync} from 'child_process'

export function getNxAffectedApps({base, head, workspace}: Props): string[] {
  execSync('npm i -g @nrwl/cli')
  const result = execSync(`nx affected:apps --base=${base} --head=${head}`, {
    cwd: workspace
  }).toString()

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
  base: string
  head: string
  workspace: string
}
