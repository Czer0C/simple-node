const express = require('express')

require('dotenv').config()

const PORT = process.env.SERVICE_PORT || 5000

const app = express()

const cors = require('cors')

app.use(cors())

app.use(express.json())
// for JSON bodies
app.use(express.urlencoded({ extended: true })) // for URL-encoded bodies


app.get('/', (req, res) => {
    res.send('You smart, you loyal, you a genius')
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})