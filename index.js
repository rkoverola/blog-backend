const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const { MONGODB_URI, PORT } = require('./utils/config')
const logger = require('./utils/logger')

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

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})