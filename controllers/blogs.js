const blogsRoutes = require('express').Router();
const Blog = require('../models/blog.js');

blogsRoutes.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;

  const selectedBlog = await Blog.findById(id);
  response.json(selectedBlog);
});

blogsRoutes.post('/', async (request, response) => {
  const { body } = request;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRoutes.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

const options = {
  new: true,
  runValidators: true,
  context: 'query'
};

blogsRoutes.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const { id } = request.params;

  const blog = { title, author, url, likes };

  const updatedPerson = await Blog.findByIdAndUpdate(id, blog, options);
  response.json(updatedPerson);
});

module.exports = blogsRoutes;
