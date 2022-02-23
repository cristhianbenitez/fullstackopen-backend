const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Essay Writing 101',
    author: 'Cristhian Benitez',
    url: 'essaywriting.com/',
    likes: 101
  },
  {
    title: 'Essay Writing 101',
    author: 'Cristhian Benitez',
    url: 'essaywriting.com/',
    likes: 101
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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
};
