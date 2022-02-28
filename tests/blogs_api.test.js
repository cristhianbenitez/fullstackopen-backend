const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

// login to get the token before starting the test
let token;
beforeEach(async () => {
  const loginDetails = await api
    .post('/api/login')
    .send({ username: 'cris0987', password: '123456' })
    .expect(200)
    .expect('Content-Type', /application\/json/);
  token = loginDetails.body.token;
});

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test('blogs are returned in json ', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test('fails with status code 400 if note does not exist', async () => {
    const validNoneExistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNoneExistingId}1`).expect(400);
  });

  test('fails with status code 400 id is invalid', async () => {
    const invalidId = '5a3d5d21312421412312';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('addition of a blog', () => {
  test('succeed with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = {
      title: 'Blog 3',
      author: ' Baaadenitez',
      url: 'essaywriaaating.com/',
      likes: 120
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    const likes = await blogsAtEnd.map((b) => b.likes);

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    likes.forEach((like) => {
      expect(like).toBeGreaterThanOrEqual(0);
    });
  });

  test('fails with status code 400 if data is not valid', async () => {
    const newBlog = {
      title: '',
      author: '',
      url: 'essaywriaaating.com/',
      likes: 12231
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('deletion of blog', () => {
  test('succeed with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((b) => b.titles);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('update of blog ', () => {
  test('succeed with status code 200 if blog has been updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: 'Essaaay aaag 101',
      author: 'Craaaistaaaitez',
      url: 'essaating.com/',
      likes: '101'
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.title).toBe(updatedBlog.title);
    expect(blogToUpdate).not.toEqual(updatedBlog);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
