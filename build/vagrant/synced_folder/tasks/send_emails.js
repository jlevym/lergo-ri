var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var accessKeyId = process.env.accessKeyId;
var secretAccessKey = process.env.secretAccessKey;
var CI_COMMIT_MESSAGE=process.env.CI_COMMIT_MESSAGE;
var CI_TIMESTAMP=process.env.CI_TIMESTAMP;
var BUILD_NUMBER=process.env.BUILD_NUMBER;

// the aws accessKey and secretAccessKey are from lergopro
var transporter = nodemailer.createTransport(ses({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region : 'eu-west-1'

}));

transporter.sendMail({
    from: '4lergo@gmail.com',
    to: 'jlevym@gmail.com',
    subject: `lergopro has been upgraded`,
    text: `lergopro has been upgraded with the latest commit and is ready for review.
    Build Number:${BUILD_NUMBER}
    BuildID: ${CI_TIMESTAMP}
    Commit Message: ${CI_COMMIT_MESSAGE}`
});
