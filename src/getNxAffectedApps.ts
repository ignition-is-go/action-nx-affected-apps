import {execSync} from 'child_process'
import * as core from '@actions/core'

export function getNxAffectedApps({base, head, workspace}: Props): string[] {
    const args = `${base ? `--base=${base}` : ''} ${
        head ? `--head=${head}` : ''
    }`
    let result
    try {
        const cmd = `npm run nx -- affected:apps ${args}`
        core.debug(`Attempting npm script: ${cmd}`)
        result = execSync(cmd, {
            cwd: workspace
        }).toString()
    } catch (e) {
        core.debug(`first attempt failed: ${e.message}`)
        try {
            const cmd = `./node_modules/.bin/nx affected:apps ${args}`
            core.debug(`Attempting from node modules: ${cmd}`)
            result = execSync(cmd, {
                cwd: workspace
            }).toString()
        } catch (e2) {
            try {
                core.debug(`second attempt failed: ${e2.message}`)
                const cmd = `nx affected:apps ${args}`
                core.debug(`Attempting global npm bin: ${cmd}`)
                result = execSync(cmd, {
                    cwd: workspace
                }).toString()
            } catch (e3) {
                core.debug(`third attempt failed: ${e3.message}`)
                throw Error(
                    'Could not run NX cli...Did you install it globally and in your project? Also, try adding this npm script: "nx":"nx"'
                )
            }
        }
    }

    if (!result) {
        return []
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
