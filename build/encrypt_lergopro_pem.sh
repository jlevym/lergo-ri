if [ "$1" != "" ];then
    TESTME_KEY="$1"
fi

openssl aes-256-cbc -a -salt -in conf/dev/lergopro.pem -out build/lergopro.pem.enc -pass  pass:$TESTME_KEY