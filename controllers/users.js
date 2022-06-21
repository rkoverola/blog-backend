const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
  if(!username || !password) {
    response.status(400).json({ error: 'Username and password required' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash
  })
  const result = await newUser.save()
  response.status(201).json(result)
})

module.exports = usersRouter