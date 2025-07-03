// Middleware to check for specific user role
function authorizeRole(roles) {
  // Accept a single role as string or multiple roles as array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Allowed roles: ${allowedRoles.join(', ')}` });
    }
    next();
  };
}

module.exports = authorizeRole;
