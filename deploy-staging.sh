#!/bin/bash

docker build -f app.dockerfile -t deviant.code:5000/sentry:3.0.0 .
docker push deviant.code:5000/sentry:3.0.0


