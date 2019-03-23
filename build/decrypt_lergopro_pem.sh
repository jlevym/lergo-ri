
echo 'TESTME_KEY: ' $TESTME_KEY

openssl aes-256-cbc -d -a -in build/lergopro.pem.enc -out conf/dev/lergopro.pem -pass pass:$TESTME_KEY