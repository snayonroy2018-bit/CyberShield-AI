/**
 * CyberShield AI - JWT Authentication Middleware
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cybershield_ai_super_secret_jwt_key_2026';

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.header('x-auth-token');

  // If no token, allow anonymous or reject if strict
  if (!token) {
    req.user = { id: 'anonymous', username: 'Guest User', role: 'user' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is invalid or expired. Please login again.' });
  }
};
