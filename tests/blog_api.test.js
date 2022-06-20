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

  test('given database then should be able to post valid blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const validBlog = {
      title: 'Testing is fun',
      author: 'Supertest',
      url: 'www.test.com',
      likes: 150
    }
    const validBlogObject = new Blog(validBlog)
    await validBlogObject.save()
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Testing is fun')
  })
})

afterAll( () => {
  mongoose.connection.close()
})