#!/bin/bash

echo using lergo-ri as a base to send emails
cd lergo-ri
source ~/.nvm/nvm.sh
nvm install

echo 96 > temp_build_number.txt

echo 'get the build number from tmp file'
export build_number=$(cat temp_build_number);

echo $BUILD_NUMBER > temp_build_number.txt

var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

// the aws accessKey and secretAccessKey are from lergopro

var transporter = nodemailer.createTransport(ses({
    accessKeyId: $accessKeyId,
    secretAccessKey: $secretAccessKey,
    region : "eu-west-1"

}));

transporter.sendMail({
    from: '4lergo@gmail.com',
    to: 'jlevym.com',
    subject: `lergopro has been upgraded`,
    text: `lergopro has been upgraded with the latest commit. The Build number is $BUILD_NUMBER`
  });