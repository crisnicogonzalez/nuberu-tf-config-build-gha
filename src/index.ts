/**
 * The entrypoint for the action.
 */
import { run } from './main'
import * as core from '@actions/core'

// eslint-disable-next-line @typescript-eslint/no-floating-promises

function main() {
  const mode: string = core.getInput('mode')
  const organization: string = core.getInput('organization')
  run(mode, organization).catch(error => {
    core.setFailed(error)
  })
}

main()
