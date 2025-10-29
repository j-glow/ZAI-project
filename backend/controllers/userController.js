const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ where: { username } });

  if (userExists) {
    return res.status(400).send('User already exists');
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).send('Invalid user data');
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).send('Invalid username or password');
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!(await user.matchPassword(oldPassword))) {
    return res.status(401).json({ message: 'Invalid old password' });
  }

  if (await user.matchPassword(newPassword)) {
    return res.status(400).json({ message: 'New password cannot be the same as the old password.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({ message: 'Password updated successfully' });
};


module.exports = { registerUser, authUser, changePassword };