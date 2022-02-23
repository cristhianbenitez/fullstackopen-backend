const _ = require('lodash');

const totalLikes = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0].likes;
  }
};

const favoriteBlog = (blogs) => {
  const blogsLikes = blogs.map((b) => b.likes);
  const mostLikes = Math.max(...blogsLikes);
  return blogs.find((blog) => blog.likes === mostLikes);
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((b) => b.author);
  const amountOfBlogs = _.countBy(authors);
  const a = authors.forEach((a) => console.log(a));
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
};
