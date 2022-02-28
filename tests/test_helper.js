// Blogs
const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Cristhian Benitez',
    url: 'essaywriting.com/',
    likes: 101,
    user: '621cfa391d298e1f29b06731'
  },
  {
    title: 'Blog 2 ',
    author: 'Cristhian Benitez',
    url: 'essaywriting.com/',
    likes: 101,
    user: '621cfa391d298e1f29b06731'
  }
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Ess1312321',
    author: 'Cristasdastez',
    url: 'essaywasdascom/',
    likes: 11111
  });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

// Users
const User = require('../models/user');

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
};
