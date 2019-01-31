package main

import (
	"fmt"
	"os"
	"bufio"
	"io/ioutil"
	"net/url"
	"net/http"
	"time"
	"encoding/json"
	"strings"
)

var nluHost string = "localhost:5000"

type NluResponse struct {
	Intent struct {
		Name       string  `json:"name"`
		Confidence float64 `json:"confidence"`
	} `json:"intent"`
	Entities []struct {
		Start      int     `json:"start"`
		End        int     `json:"end"`
		Value      string  `json:"value"`
		Entity     string  `json:"entity"`
		Confidence float64 `json:"confidence"`
		Extractor  string  `json:"extractor"`
	} `json:"entities"`
	IntentRanking []interface{} `json:"intent_ranking"`
	Text          string        `json:"text"`
	Project       string        `json:"project"`
	Model         string        `json:"model"`
}

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("Usage: %s <file> <project=dev__botpress__all> <nlu=localhost:5000>\n", os.Args[0])
		os.Exit(1)
	}

	model := "dev__botpress__all"
	if len(os.Args) == 3 {
		model = os.Args[2]
	}

	if len(os.Args) == 4 {
		nluHost = os.Args[3]
	}

	inFile := os.Args[1]

	lines, err := scanLines(inFile)
	if err != nil {
		panic(err)
	}

	totalcount := 0
	simplematch := 0
	entitymatch := 0

	for _, lstr := range lines {
		lineIntent, line := splitLine(lstr)
		nlu := getNluResponse(line, model)
		totalcount++

		if nlu.Intent.Name == lineIntent {
			simplematch++
			continue
		}

		fmt.Print(lineIntent + " '" + line + "'" + " --> ")
		fmt.Print("'" + nlu.Intent.Name + "'  ")

		if len(nlu.Entities) > 0 && nlu.Entities[0].Entity == lineIntent  {
			entitymatch++
			fmt.Print(nlu.Entities[0].Entity)
			fmt.Print(" '" + nlu.Entities[0].Value + "' ")
		}
		fmt.Println()
	}

	fmt.Println("Intent matches:", simplematch)
	fmt.Println("Entity matches:", entitymatch)
	fmt.Println("Total tests   :", totalcount)
	ratio := float64(simplematch) / float64(totalcount)
	fmt.Printf ("Ratio         : %.2f\n", ratio)
}

func splitLine(line string) (string, string) {
	res :=  strings.SplitN(line, ":", 2)
	return res[0], res[1]
}

func getNluResponse(msg string, model string) NluResponse {
	url, _ := url.Parse("http://" + nluHost + "/parse?project=olivermodel&q=DUMMY")
	q := url.Query()
	q.Set("q", msg)
	q.Set("project", model)
	url.RawQuery = q.Encode()
	endpoint := url.String()

	client := http.Client{
		Timeout: time.Second * 2,
	}

	req, _ := http.NewRequest(http.MethodGet, endpoint, nil)
	req.Header.Set("User-Agent", "gotools-fabian")
	res, err := client.Do(req)
	if err != nil {
                fmt.Println("Failed to get data from host", nluHost)
                os.Exit(1)
        }

	body, _ := ioutil.ReadAll(res.Body)

	nlu := NluResponse{}
	json.Unmarshal(body, &nlu)

	return nlu
}

func scanLines(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)

	scanner.Split(bufio.ScanLines)

	var lines []string

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	return lines, nil
}
