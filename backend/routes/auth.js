const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Admin hardcoded credentials (for demo)
const ADMIN = {
  username: 'admin',
  password: 'admin123', // Change in production
  role: 'admin',
  email: 'admin@drdo.com',
  department: 'HR',
};

// Login route
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  let user;
  if (role === 'admin') {
    // Check hardcoded admin
    if (username === ADMIN.username && password === ADMIN.password) {
      const token = jwt.sign({ username: ADMIN.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: ADMIN });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } else {
    user = await User.findOne({ username, role });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  }
});

// Change password (for mentors)
router.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid old password' });
  user.password = await bcrypt.hash(newPassword, 10);
  user.tempPassword = false;
  await user.save();
  res.json({ message: 'Password changed successfully' });
});

module.exports = router; 