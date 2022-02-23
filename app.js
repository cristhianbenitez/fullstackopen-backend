const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');

const { MONGODB_URI } = require('./utils/config');
const blogsRoutes = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
