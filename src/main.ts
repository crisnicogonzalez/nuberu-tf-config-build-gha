import {writeFile} from 'fs'
import { exec } from 'child_process';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const diff = await execPromise('git diff --name-only main...HEAD');
    const folderChanges = diff.split("\n");
    for (const folderChange of folderChanges) {
      console.log(folderChange)
    }

    if (folderChanges.length !== 1){
      return Promise.reject("there is changes on more than one folder")
    }


    const terraformConfig: string =` 
      terraform {
        backend "s3" {
          bucket  = "allaria-development-tf-remote-state"
          key     = ${folderChanges[0]}
          region  = "us-east-1"
          profile = "development"
        }
      }
            
      provider "aws" {
         region  = "us-east-1"
         profile = "development"
            
         default_tags {
            tags = {
              ManagedBy    = "terraform"
              Environment  = "development"
              Dir          = ${folderChanges[0]}
            }
          }
      }`;

    const filename: string = 'config.tf';
    writeFile(filename, terraformConfig, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('Error writing the Terraform configuration file:', err);
      } else {
        console.log('Terraform configuration file created successfully.');
      }
    });


  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) console.log("error",error)
  }
}

const execPromise = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

run()
