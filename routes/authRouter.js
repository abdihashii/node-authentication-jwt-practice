/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../Models/UserModel');

// Validation
const {
  registerValidation,
  loginValidation,
} = require('../middlewares/userValidation');

async function getUser(req, res, next) {
  let user;

  try {
    // findById() gets one user from Model
    user = await User.findById(req.params.id);

    if (user == null) {
      // 404 means you can't find something
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  return next();
}

router.get('/:id', getUser, async (req, res) => {
  res.json(res.user);
});

router.delete('/:id', getUser, async (req, res) => {
  const userName = res.user.name;

  try {
    await res.user.remove();
    res.send(`Deleted user: ${userName}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  // Validate data before we make a user
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists!');

  // Hash password
  // 1. generate a SALT - 10 is the complexity of the string that gets generated
  const salt = await bcrypt.genSalt(10);
  // 2. create a hash
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    // Save new user
    const newUser = await user.save();
    return res.status(201).json({ user: newUser._id });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  // Validate login data
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    // Check if the email exists in database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email doesn't exist!");

    // Check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) return res.status(400).send('Invalid password!');

    // JWT
    // 1. create  and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    // 2. add to header
    return (
      res
        .header('auth-token', token)
        // .send(`Logged in user: ${req.body.email}, with token: ${token}`);
        .send({ message: 'Logged in!', user: req.body.email, token })
    );

    // return res.send('Logged in!');
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
