const express = require('express');

require('dotenv').config();

const {
  mongooseBase,
  mongooseLog,
  mongoosePop
} = require('./mongoose')


const PORT = process.env.SERVICE_PORT || 5000;

const app = express();

const cors = require('cors');

const { initPg, pgWriteLog, pgLastLog, pgLog } = require('./pg');

app.use(cors());

app.use(express.json());
// for JSON bodies
app.use(express.urlencoded({ extended: true })); // for URL-encoded bodies

// ! POSTGRES
// ! ------------------

initPg()

app.use(pgWriteLog)

app.use('/pgLog', pgLog)

app.use('/pgLastLog', pgLastLog)

// ! MONGODB
// ! ------------------

// app.use(mongooseBase);

// app.get('/log', mongooseLog);

// app.get('/pop', mongoosePop);

// ! ------------------

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
