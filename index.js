const express = require('express')

require('dotenv').config()

const app = express()

const cors = require('cors')

app.use(cors())

app.use(express.json())
// for JSON bodies
app.use(express.urlencoded({ extended: true })) // for URL-encoded bodies

const PORT = process.env.SERVICE_PORT || 5000

app.get('/', (req, res) => {
    res.send('Alive')
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + process.env.SERVICE_PORT)
})