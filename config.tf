 
      terraform {
        backend "s3" {
          bucket  = "allaria-development-tf-remote-state"
          key     = ".github/workflows/ci.yml"
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
              Dir          = ".github/workflows/ci.yml"
            }
          }
      }