#!/bin/bash

echo using lergo-ri as a base to send emails
cd lergo-ri
source ~/.nvm/nvm.sh
nvm install

export accessKeyId=$accessKeyId
export secretAccessKey=$secretAccessKey
export CI_COMMIT_MESSAGE=$CI_COMMIT_MESSAGE
export CI_TIMESTAMP=${CI_STRING_TIME:-local-build-id}

echo get the build number from build-tracker
aws s3 cp s3://lergopro-backups/artifacts/build-number-tracker/build-tracker.txt build-tracker.txt
export BUILD_NUMBER=`cat build-tracker.txt`

# echo 'get the build number from build_number.txt'
# export BUILD_NUMBER=$(cat /tmp_build/build_number.txt);

cd build/vagrant/synced_folder/tasks

node send_emails.js