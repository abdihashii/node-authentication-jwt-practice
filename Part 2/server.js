require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const posts = [
  {
    username: 'Abdirahman',
    title: 'Post 1',
  },
  {
    username: 'Abdimalik',
    title: 'Post 2',
  },
];

// Middlewares
app.use(express.json());
function authenticateToken(req, res, next) {
  // get the token they send us
  const authHeader = req.headers['authorization'];
  //// going  to return Bearer Token, so we need to capture the second value using [1]
  const token = authHeader && authHeader.split(' ')[1];
  // 401 means they have no access
  if (token == null) return res.sendStatus(401);

  // verify that this is the correct user
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // 403 means you have a token, but it's no longer valid
    if (err) return res.sendStatus(403);

    // then return the user
    req.user = user;

    return next();
  });
}

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.listen(3000, () => console.log('Server is running'));
