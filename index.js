const express = require('express');

require('dotenv').config();

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

console.log({ MONGO_URI });

const PORT = process.env.SERVICE_PORT || 5000;

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());
// for JSON bodies
app.use(express.urlencoded({ extended: true })); // for URL-encoded bodies

const client = mongoose.connect(MONGO_URI);

client.then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

const logSchema = new mongoose.Schema({
  method: String,
  url: String,
  statusCode: Number,
  elapsedTime: String,
  ip: String,
  time: String,
  headers: Object
});

const Log = mongoose.model('Log', logSchema);

app.use(async (req, res, next) => {
  const start = process.hrtime(); // High-resolution timer

  res.on('finish', () => {
    const diff = process.hrtime(start); // Get time difference

    const elapsedTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // Convert to milliseconds

    const time = new Date().toISOString().replace('T', ' ').replace('Z', '')

    const processInfo = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      elapsedTime: `${elapsedTime} ms`,
      ip: req.headers['x-forwarded-for'] || null,
      time,
      headers: req.headers
    }

    Log.create(processInfo).then(log => {
      console.log(`${time}, elapsed time: ${elapsedTime} ms`);
    }).catch(err => {
      console.error('Error saving log', err);
    });
  });

  next();
});

app.get('/log', (req, res) => {

  const ip = req.headers['x-forwarded-for'] || null;

  const time = new Date().toISOString().replace('T', ' ').replace('Z', '')

  const log = {
    ip, time,
  }

  res.json(log)
});

// app.get('/logs', (req, res) => {
//   Log.find().then(logs => {
//     res.json(logs)
//   }).catch(err => {
//     console.error('Error getting logs', err);
//     res.status(500).send('Error getting logs');
//   });
// });

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
