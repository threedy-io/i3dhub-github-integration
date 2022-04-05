## Github RESTFul Gateway
A simple REST API to download files from Github Repository and serve it to instant3Dhub.

## Requirements
- You need to have Go installed. See [Link to download Go](https://go.dev/) for further details.

## APIs
GET [/githubFile/:owner-name/:repo-name/:fileName -- Example](http://localhost:8080/githubFile/owner-name/repo-name/CQU20_CQ-M5x55L.jt) Download a file with a name from github repository
 
## Run
Run *go run . -host=localhost -port=8080* to start the app on  **localhost:8080/**
* **HOST**: Optionally, you can provide the host to listen for 
* **PORT**: The port used for listening,default 8090.