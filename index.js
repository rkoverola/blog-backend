const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')

logger.info('Connecting to MongoDB')
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('ERROR: ', error)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})