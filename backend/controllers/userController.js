const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).send('User already exists');
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send('Invalid user data');
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send('Invalid username or password');
  }
};

const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && newPassword) {
    user.password = newPassword;
    await user.save();
    res.send('Password updated successfully');
  } else {
    res.status(400).send('User not found or no new password provided');
  }
};


module.exports = { registerUser, authUser, changePassword };
