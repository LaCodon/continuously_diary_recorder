# Make it fly

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
 - name: "ner_crf"
   BILOU_flag: false
 - name: "intent_featurizer_count_vectors"
 - name: "intent_classifier_tensorflow_embedding"
```

**Update:** Lastly, I had better recognition results with the tensorflow pipeline. To use this, start RASA like that (no further config required):

```docker run -p 5000:5000 rasa/rasa_nlu:latest-tensorflow```

**Important:** The tensorflow pipeline is per default non deterministic. This results in slighlty different training results each time you retrain the network. See https://rasa.com/docs/nlu/components/#intent-classifier-tensorflow-embedding for more information, search for ```random_seed```.

## Install the bot

Run `yarn install` to install the bot.

## Run the bot

The easiest way to run the bot in development is by executing ```./run-dev.sh``` in the root folder. It will set some env vars for you. Make sure to adapt the run script according to your needs.

After the first start you have to train the NLU once via the Botpress GUI (default on localhost:4000). Goto NLU > Sync Model. Then restart the bot.

## Docker

Build the container image: ```docker build -t classifier-bot:latest .```

Run the image: ```docker run --rm -p 4000:4000 -e ROCKETCHAT_URL=http://10.0.2.15:3001 -e NLU_RASA_URL=http://10.0.2.15:5000 classifier-bot:latest```

You should adapt all environment variables to meet your requirements. For all available environment variables, have a look into the ```run-dev.sh``` script.

The container will automatically train your RASA model on startup. You should think about mounting the ```/generated/intents/``` directory to your host system to persist changes in your traingset.

**Important:** The Bot uses Sqlite as a storage backend. The database file will be located in ```/.data/```. Consider mountig this directory as persistent docker volume. If you want to use postgres instead of sqlite, have a look at https://botpress.io/docs/10.50/recipes/dbs/

## API

The Bot offers an API to get the collected data:

- ```GET /api/botpress-diary``` List IDs of users who sent data
- ```GET /api/botpress-diary/:userId?[sentAfter=2019-01-23T10:16:46.044Z]``` List the data and optionally filter for messages newer than a given date

# Getting started with Botpress

The best explanation for Botpress can be found on [their website](https://botpress.io/docs/10.50/getting_started/trivia_flows/).

# Adapting the RASA trainingsset

All intents and utterances are stored under ```/generated/intents/```. The filename defines the name of the intent. Utterances are stored line by line in the ```<intent>.utterances.txt``` file. Entities are marked with ```[<value>](<entity-name>)```.

E. g.: ```Ich war im Review und [habe danach](message_done) eine Veranstaltung [vorbereitet](message_done)```

It's recommended to use the Botpress UI to edit intents and utterances but especially for bulk editing, you could work with the explained text files.

Make sure to retrain (sync) your RASA model via the respective button in the UI after editing to apply your changes.

# Other stuff

Kudos to https://github.com/vishnubob/wait-for-it
