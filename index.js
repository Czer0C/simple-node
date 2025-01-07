const express = require('express');

require('dotenv').config();

const PORT = process.env.SERVICE_PORT || 5000;

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());
// for JSON bodies
app.use(express.urlencoded({ extended: true })); // for URL-encoded bodies

const list = ['You smart', 'You genius', 'You loyal', 'I Appreciate you'];

app.get('/', (req, res) => {
  const rand = Math.floor(Math.random() * 100) % 4;

  res.send(`${list[rand]}`);
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
