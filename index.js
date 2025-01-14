const express = require('express');

require('dotenv').config();

const PORT = process.env.SERVICE_PORT || 5000;

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());
// for JSON bodies
app.use(express.urlencoded({ extended: true })); // for URL-encoded bodies


app.get('/', (req, res) => {

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


  const time = new Date().toISOString().replace('T', ' ').replace('Z', '')

  const log = {
    ip, time
  }

  console.log(log);

  res.json(log)

});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
