# Go Tools

This directory contains go tools which might be helpful in combination with the RASA NLU

## modeltester.go

This program can be used to test the performance of a trained RASA model.

Installation: ```go install modeltester.go```

Usage: ```modeltester <file> <project=dev__botpress__all> <nlu=localhost:5000>```

  * **file**: The file with the test cases. Format: ```<expected intent>:<message>```
  
  * **project**: The project to test, defaults to ```dev__botpress__all```
  
  * **nlu**: The host and port of the RASA instance, defaults to ```localhost:5000```
  
Output: All test cases which have failed and an overall result score


## rasatobotpress.go

This tool converts RASA trainingsets into the format used by botpress. E. g. you could generate a RASA trainingset on https://rasahq.github.io/rasa-nlu-trainer/ and then convert it via this tool for usage in Botpress.

Installation: ```go install rasatobotpress.go```

Usage: ```rasatobotpress <rasa trainingset>```

  * **rasa trainingset**: The RASA trainingset as file in JSON format
  
Output: The converted Botpress trainingset. Paste this into a file like ```/generated/intents/myintent.utterances.txt``` 
