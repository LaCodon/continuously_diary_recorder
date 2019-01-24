## Prerequisites

* RASA NLU
* Rocket.Chat
* Node.js
* yarn (somehow npm does not work for me)

## Setup RASA

Basically, you can do what works best for you here but the following is my advice:

```docker run -v `pwd`/config.yml:/app/config.yml -p 5000:5000 rasa/rasa_nlu:latest-full```

with following config.yml:

```yaml
language: "de"

pipeline:
 - name: "nlp_spacy"
 - name: "tokenizer_spacy"
 - name: "intent_featurizer_count_vectors"
 - name: "intent_classifier_tensorflow_embedding"
```

## Install the bot

Run `yarn install` to install the bot.

## Run the bot

The easiest way to run the bot is by executing ```./run.sh``` in the root folder. It will set some env vars for you. Make sure to adapt the run script according to your needs.

After the first start you have to train the NLU once via the Botpress GUI (default on localhost:4000). Goto NLU > Sync Model

## API

The Bot offers an API to get the collected data:

- ```GET /api/botpress-diary``` List IDs of users who sent data
- ```GET /api/botpress-diary/:userId?[sentAfter=2019-01-23T10:16:46.044Z]``` List the data and optionally filter for messages newer than a given date
