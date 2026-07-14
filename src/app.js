const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

/**
 * - Routes required
 */
const userRoute = require('./routes/auth.route')
const accountRoute = require('./routes/account.route')

/**
 * - use routes middleware
 */
app.use('/api/auth', userRoute)
app.use('/api/account', accountRoute)

module.exports = app
