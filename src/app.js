const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const userRoute = require('./routes/auth.route')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', userRoute)

module.exports = app
