var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var accessKeyId = process.env.accessKeyId;
var secretAccessKey = process.env.secretAccessKey;
// the aws accessKey and secretAccessKey are from lergopro
var transporter = nodemailer.createTransport(ses({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region : "eu-west-1"

}));

transporter.sendMail({
    from: '4lergo@gmail.com',
    to: 'jlevym.com',
    subject: `lergopro has been upgraded`,
    text: `lergopro has been upgraded with the latest commit. The Build number is $BUILD_NUMBER`
});
