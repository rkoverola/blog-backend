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
    const blogs = await helper.blogsInDb()
    for(let blog of blogs) {
      const processedBlog = JSON.parse(JSON.stringify(blog))
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
    await api
      .post('/api/blogs')
      .send(validBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Testing is fun')
  })

  test('given a blog with missing likes property then should save with default 0', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const invalidBlog = {
      title: 'This post has no likes',
      author: 'Supertest',
      url: 'www.test.com'
    }
    await api
      .post('/api/blogs')
      .send(invalidBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    const addedBlog = blogsAtEnd.find(b => b.title === 'This post has no likes')
    expect(addedBlog.likes).toBe(0)
  })

  test('given blog with missing title and url then posting yields code 400', async () => {
    const invalidBlog = {
      author: 'Dumbass',
    }
    await api
      .post('/api/blogs')
      .send(invalidBlog)
      .expect(400)
  })

  test('given database then should be able to delete a specific post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(blogToDelete.id)
  })
})

afterAll( () => {
  mongoose.connection.close()
})