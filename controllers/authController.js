const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

// User login route
router.post('/login', async (req, res) => {
  const { phone_number, password } = req.body;

  // Validate user credentials (you may implement your own logic)
  const user = await User.findOne({ where: { phone_number, password } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

  res.json({ token });
});

// User registration route
router.post('/register', async (req, res) => {
  const { phone_number, password, priority } = req.body;

  // Validating input 
  if (!phone_number || !password || !priority) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  // Checking if the phone number is already registered
  const existingUser = await User.findOne({ where: { phone_number } });

  if (existingUser) {
    return res.status(409).json({ message: 'Phone number already registered' });
  }

  // Creating a new user
  const newUser = await User.create({ phone_number, password, priority });

  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

module.exports = router;
