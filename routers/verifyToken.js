const jwt = require('jsonwebtoken');

// Middleware function to be used by any route to be protected
function verifyUser(req, res, next) {
  // Get auth token from request header. Check if token exists
  const token = req.header('auth-token');

  if (!token) return res.status(401).send('Access Denied!');

  try {
    // Verify if token has been found, returns the user _id
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = verified;
  } catch (err) {
    res.status(400).send('Invalid Token!');
  }

  return next();
}

module.exports = verifyUser;
