#!/bin/bash

docker build -f app.dockerfile -t deviant.code:5000/sentry:3.0.0 .
docker push deviant.code:5000/sentry:3.0.0

#Git operations

CURRENTDATE=`date +"%m%I%M%b%Y"`
git add --all
git commit -m "${CURRENTDATE} Auto Backup"
git push
echo -en \\07
