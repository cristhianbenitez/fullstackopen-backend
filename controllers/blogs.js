const blogsRouter = require('express').Router();
const { userExtractor } = require('../utils/middleware');

const Blog = require('../models/blog.js');
const User = require('../models/user.js');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const selectedBlog = await Blog.findById(id);
  response.json(selectedBlog);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { id } = request.params;

  if (!request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const blog = await Blog.findById(id);

  if (!blog) {
    return response
      .status(400)
      .json({ error: 'blog does not exist or has been deleted' });
  }

  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } else {
    response.status(401).end();
  }
});

const options = {
  new: true,
  runValidators: true,
  context: 'query'
};

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const { id } = request.params;

  const blog = { title, author, url, likes };

  const updatedPerson = await Blog.findByIdAndUpdate(id, blog, options);
  response.json(updatedPerson);
});

module.exports = blogsRouter;
