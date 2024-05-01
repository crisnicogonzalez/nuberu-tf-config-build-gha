import { promises as fs } from 'fs'
import { exec } from 'child_process'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(
  mode: string,
  organization: string,
  environment: string
): Promise<string> {
  if (mode !== 'plan' && mode !== 'apply') throw new Error('invalid mode')
  try {
    let gitCommand
    if (mode == 'plan') {
      gitCommand = 'git diff --name-only remotes/origin/main...HEAD'
    } else {
      gitCommand = 'git diff --name-only HEAD~1 HEAD'
    }
    const diff = await execPromise(gitCommand)
    const folderChanges = diff.split('\n')
    console.log('folder changes', folderChanges)
    const filteredChangedFolder = folderChanges.filter(
      f => !f.includes('.github') && f !== ''
    )

    if (filteredChangedFolder.length === 0) return ''
    const workingDirectory = filteredChangedFolder[0].split('/main.tf')[0]
    const fileContent: string = ` 
      terraform {
        backend "s3" {
          bucket  = "${organization}-${environment}-tf-remote-state"
          key     = "${workingDirectory}"
          region  = "us-east-1"
          profile = "default"
        }
      }
            
      provider "aws" {
         region  = "us-east-1"
         profile = "default"
            
         default_tags {
            tags = {
              ManagedBy    = "terraform"
              Environment  = "${environment}"
              Dir          = "${workingDirectory}"
            }
          }
      }`

    console.log('generated file', fileContent)

    await writeFileAsync(`./${workingDirectory}/config.tf`, fileContent)
    return workingDirectory
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) console.log('error', error)
    throw new Error('error')
  }
}

const execPromise = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      if (stderr) {
        reject(stderr)
        return
      }
      resolve(stdout)
    })
  })
}

async function writeFileAsync(path: string, data: string): Promise<void> {
  try {
    await fs.writeFile(path, data)
    console.log('File written successfully')
  } catch (error) {
    console.error('Failed to write file:', error)
  }
}
