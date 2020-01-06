import * as core from '@actions/core'
import {getNxAffectedApps} from './getNxAffectedApps'

export async function run(workspace: string = '.'): Promise<void> {
    try {
        const {GITHUB_WORKSPACE = workspace} = process.env
        const base = core.getInput('base')
        const head = core.getInput('head')
        core.info(`Getting diff from ${base} to ${head || 'HEAD'}...`)
        core.info(`using dir: ${GITHUB_WORKSPACE}`)

        const apps = getNxAffectedApps({
            base,
            head,
            workspace: GITHUB_WORKSPACE
        })

        const appsString = JSON.stringify(apps)

        core.setOutput('affected_apps', appsString)
        core.exportVariable('NX_AFFECTED_APPS', appsString)
        core.info(`Found these affected apps: \n ${appsString}`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
