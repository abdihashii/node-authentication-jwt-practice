require('dotenv').config();

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const User = require('./Models/UserModel');

// Connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to DB!');
  },
);

// Import routers
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');

// Middleware
app.use(express.json());

// Routes
app.use('/api/user', authRouter);
app.use('/api/posts', postRouter);

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => console.log('Server is running!'));
