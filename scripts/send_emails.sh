#!/bin/bash

echo using lergo-ri as a base to send emails
cd lergo-ri
source ~/.nvm/nvm.sh
nvm install

echo 96 > tmp/artifacts/temp_build_number.txt

echo 'get the build number from tmp file'

export BUILD_NUMBER=$(cat tmp/artifacts/temp_build_number.txt);

echo $BUILD_NUMBER > tmp/artifacts/temp_build_number.txt


cd /build/vagrant/synced_folder/tasks
ls
node send_mail.js