const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const path = __dirname + '/views/';

const app = express();
app.use(express.static(path));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let tokens = []

app.post('/token/new', (req, res) => {
  tokens = tokens.filter(token => token.userId !== req.body.userId);
  tokens.push(req.body);
  res.send(200);
});

app.post('/token/renew', async (req, res) => {
  const foundToken = tokens.find(token => token.token === req.body.token)
  if (!foundToken) {
    res.send({ redirectUrl: 'https://mediaclipuploadfirstserver.azurewebsites.net/' })
  } else {
    const hubApiAuth = foundToken.hubApiAuth
    const result = await axios.post('https://api.mediacliphub.com/auth/jwt/renew', {
      scheme: req.body.scheme,
      token: req.body.token
    },
    {
      headers: {
        Authorization: `HubApi ${hubApiAuth}`
      }
    });
    res.send(result.data)
    tokens = tokens.filter(token => token.token !== foundToken.token);
    tokens.push({
      ...result.data,
      hubApiAuth
    });
  }
})

app.get('/', (req, res) => {
  res.sendFile(path + "index.html");
});

// app.post('/cart', (req, res) => {

// })

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`mediaclip upload first app started. listening to port ${PORT}`);
});