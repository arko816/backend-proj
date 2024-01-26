const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

function authMiddleware(req, res, next) {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Check if token is not provided
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach the decoded user to the request object for future use
    req.user = decoded;

    // Check if the user exists (optional: you may perform additional checks)
    const user = User.findOne({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
}

module.exports = authMiddleware;
