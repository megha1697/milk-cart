const express = require('express')
require('./src/db')

const milkCartRoutes = require('./src/routes')

const app = express()

app.use(express.json())
app.use(milkCartRoutes)

module.exports = app
