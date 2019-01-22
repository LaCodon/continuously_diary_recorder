#! /bin/bash

export BOTPRESS_PORT=4000
export ROCKETCHAT_URL=http://localhost:3001
export ROCKETCHAT_USER=diary-test
export ROCKETCHAT_PASSWORD=diary-test
export ROCKETCHAT_USE_SSL=false
export ROCKETCHAT_ROOM=GENERAL
export NLU_PROVIDER=rasa
export NLU_RASA_URL=http://localhost:5000/

yarn start
