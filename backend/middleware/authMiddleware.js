const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary

// Use a fallback JWT secret if environment variable is not set
const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_jwt_secret_key_for_bus_tracker_2024';

// Middleware to verify token and attach user to request
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to allow only admins
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};

module.exports = { authenticate, isAdmin };
