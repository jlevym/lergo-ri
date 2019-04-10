#!/bin/bash

echo using lergo-ri as a base to send emails
cd lergo-ri
source ~/.nvm/nvm.sh
nvm install
echo show present number in temp_build_number
ls /
echo '/artifacts/temp_build_number.txt'
cat /artifacts/temp_build_number.txt
export accessKeyId=$accessKeyId
export secretAccessKey=$secretAccessKey
export CI_COMMIT_MESSAGE=$CI_COMMIT_MESSAGE
export CI_TIMESTAMP=${CI_STRING_TIME:-local-build-id}

cat tmp/artifacts/temp_build_number.txt

echo 'get the build number from tmp file'
export BUILD_NUMBER=$(cat tmp/artifacts/temp_build_number.txt);

cd build/vagrant/synced_folder/tasks

# node send_emails.js