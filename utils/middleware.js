const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.error(error)
  if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })
  }
  next(error)
}

const requestLogger = (request, response, next) => {
  logger.info('Got request')
  logger.info(request.method)
  logger.info(request.path)
  logger.info(request.body)
  logger.info('-----')
  next()
}

const middleware = { errorHandler, requestLogger }
module.exports = middleware