 
      terraform {
        backend "s3" {
          bucket  = "allaria-development-tf-remote-state"
          key     = "us-east-1/lambda/functions/holidays/terraform.tfstate"
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
              Dir          = "us-east-1/lambdas/functions/holidays"
            }
          }
      }