const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);

router.put('/password', protect, changePassword);

module.exports = router;
