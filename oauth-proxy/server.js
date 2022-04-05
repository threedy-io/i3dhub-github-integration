const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { client_id, redirect_uri, client_secret } = require("./config");

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.json({ type: "text/*" }));
// middleware for parsing bodies from URL.
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * The * wildcard allows access from any origin
 * Allow the server and app serving client to run on different origins.
 *  */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req, res) => {
  let token = "";
  const { code } = req.body;

  // Requesting an access token by providing oauth code and other parameters as form data.
  const parametersRequest =  new FormData();
  parametersRequest.append("client_id", client_id);
  parametersRequest.append("client_secret", client_secret);
  parametersRequest.append("redirect_uri", redirect_uri);
  parametersRequest.append("code", code);

  // Prepare the the form data to use it later 
  const options = {
    method: "POST",
    body:  parametersRequest
  }
  

  // Request github to get the access token using the form data submitted
  fetch(`https://github.com/login/oauth/access_token`,options)
    .then((resp) => resp.text())
    .then((queryString) => {

      const query = new URLSearchParams(queryString);
      token= query.get("access_token");
 
      // Get data belong to logged in user
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
    })
    .then((resp) => resp.json())
    .then((resp) => {
      const newRes = {
        token: token,
        data: resp,
      };
      return res.status(200).json(newRes);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
