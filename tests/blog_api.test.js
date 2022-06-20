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

  test('given a blogs from database then id property should be defined', async () => {
    console.log('Entering test')
    const blogs = await helper.blogsInDb()
    for(let blog of blogs) {
      const processedBlog = JSON.parse(JSON.stringify(blog))
      console.log('Blog is', blog)
      console.log('pBlog is', processedBlog)
      expect(processedBlog.id).toBeDefined()
    }
  })
})

afterAll( () => {
  mongoose.connection.close()
})