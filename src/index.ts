/**
 * The entrypoint for the action.
 */
import { run } from './main'
import * as core from '@actions/core'

// eslint-disable-next-line @typescript-eslint/no-floating-promises

function main() {
  const mode: string = core.getInput('mode')
  const organization: string = core.getInput('organization')
  const environment: string = core.getInput('environment')
  run(mode, organization, environment)
    .catch(error => {
      core.setFailed(error)
    })
    .then(workDir => {
      core.setOutput('work_dir', workDir)
    })
}

main()
