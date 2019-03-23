
echo 'TESTME_KEY with -md md5: ' $TESTME_KEY

openssl aes-256-cbc -d -a -in build/lergopro.pem.enc -out conf/dev/lergopro.pem -md md5 -pass pass:$TESTME_KEY