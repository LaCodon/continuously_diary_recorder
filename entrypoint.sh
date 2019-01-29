#! /bin/bash

echo "Running Botpress and sync watcher"

./wait-for-it.sh localhost:${BOTPRESS_PORT} -t 180 -- ./trigger-sync.sh &
yarn start
