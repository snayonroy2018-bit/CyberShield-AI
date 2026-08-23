/**
 * CyberShield AI - Admin Authorization Middleware
 * Enforces that the authenticated user has role === 'admin'
 */

module.exports = function (req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      msg: 'Access denied. Administrator privileges required.'
    });
  }
  next();
};
