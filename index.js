const express = require('express');
const app = express();
const cors = require('cors');
const { MONGODB_URI, PORT } = require('./utils/config');
const mongoose = require('mongoose');
const blogsRoutes = require('./controllers/blogs');

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
