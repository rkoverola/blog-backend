const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./api_helper')

const api = supertest(app)

beforeEach( async () => {
  await Blog.deleteMany({})
  for(let blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('blog api', () => {
  test('given database then should return all blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll( () => {
  mongoose.connection.close()
})