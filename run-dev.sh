#!/bin/bash

# Port for the Botpress GUI
export BOTPRESS_PORT=4000

# e.g. "dev", "staging", "production"
export BOTPRESS_ENV=dev

# the RC server and user to connect to
export ROCKETCHAT_URL=http://localhost:3001
export ROCKETCHAT_USER=diary-test
export ROCKETCHAT_PASSWORD=diary-test
export ROCKETCHAT_USE_SSL=false
export ROCKETCHAT_ROOM=GENERAL

# if not set, the internal Botpress NLU will be used
export NLU_PROVIDER=rasa
export NLU_RASA_URL=http://localhost:5000/

yarn start
