#!/bin/bash

if [ -z "$BOTPRESS_PORT" ]; then
	echo "trigger-sync.sh: env var BOTPRESS_PORT has to be set, aborted.";
	exit 1;
fi

curl http://localhost:${BOTPRESS_PORT}/api/botpress-nlu/sync

if [ $? -eq "0" ]; then
	echo " -> The NLU has just been synced for you. The bot should now be fully functional.";
else
	echo " -> FAILED to auto sync the NLU. THE BOT MIGHT NOT BE FUNCTIONAL!";
	exit 1;
fi
