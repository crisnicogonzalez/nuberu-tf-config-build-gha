/**
 * The entrypoint for the action.
 */
import { run } from './main'
import * as core from '@actions/core'

// eslint-disable-next-line @typescript-eslint/no-floating-promises

function main() {
  run().catch(error => { core.setFailed(error)})
}

main()
