package main

import(
	"fmt"
	"os"
	"encoding/json"
	"io/ioutil"
	str "strings"
)

type RasaTraining struct {
	RasaNluData struct {
		CommonExamples []struct {
			Text     string `json:"text"`
			Intent   string `json:"intent"`
			Entities []struct {
				Start  int    `json:"start"`
				End    int    `json:"end"`
				Value  string `json:"value"`
				Entity string `json:"entity"`
			} `json:"entities"`
		} `json:"common_examples"`
	} `json:"rasa_nlu_data"`
}

func main() {
	if len(os.Args) != 2 {
		fmt.Printf("Usage: %s <rasa trainingset>\n", os.Args[0])
		os.Exit(1)
	}

	inFile := os.Args[1]
	rasa := getRasaTraining(inFile)

	for _, set := range rasa.RasaNluData.CommonExamples {
		txt := set.Text

		for _, entity := range set.Entities {
			val := entity.Value
			typ := entity.Entity

			reStr := fmt.Sprintf("[%s](%s)", val, typ)
			txt = str.Replace(txt, val, reStr, 1)
		}
		fmt.Println(txt)
	}
}

func getRasaTraining(file string) RasaTraining {
	b, _ := ioutil.ReadFile(file)

	training := RasaTraining{}
	json.Unmarshal(b, &training)

	return training
}
