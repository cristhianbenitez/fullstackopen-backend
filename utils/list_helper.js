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

const mostBlogs = (b) => {
  const authors = b.map((b) => b.author);
  // The _ creates a lodash object which allows for implicit method chaining.
  // Implicit method chaining means that in certain circumstances it may return a
  // primitive value, in others  it may return a lodash object.
  const [author, blogs] = _(authors).countBy().entries().max();
  return { author, blogs };
};

const mostLikes = (b) => {
  const maxLikes = _.max(b.map((b) => b.likes));
  const result = b.find((b) => b.likes === maxLikes);
  return { author: result.author, likes: result.likes };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
