const express = require('express');
const bodyParser = require('body-parser');

const path = __dirname + '/views/';

const app = express();
app.use(express.static(path));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path + "index.html");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`mediaclip upload first app listening to port ${PORT}`);
});