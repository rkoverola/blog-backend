const { MONGODB_URI } = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const blogRouter = require('./controllers/blogs')
const { errorHandler, requestLogger } = require('./utils/middleware')

logger.info('Connecting to MongoDB')
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('ERROR: ', error)
  })

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogRouter)

app.use(errorHandler)

module.exports = app