const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const { updateUser, listPendingUsers, approveUser, rejectUser, listAllUsers, deleteUser } = require('../controllers/authController');

// 🔐 Protected route accessible to all authenticated users
router.get('/dashboard-data', authenticate, (req, res) => {
  res.json({
    msg: `Welcome, ${req.user.role}!`,
    userId: req.user._id, // Use _id from Mongoose
    role: req.user.role,
    name: req.user.name,
    email: req.user.email,
  });
});

// 🛡️ Protected admin-only test route (optional)
router.get('/admin-only', authenticate, isAdmin, (req, res) => {
  res.json({
    msg: 'This is a protected admin-only route.',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    }
  });
});

// Update user details (driver or any authenticated user)
router.put('/update-user/:id', authenticate, updateUser);

// Admin-only: List, approve, reject pending users
router.get('/pending-users', authenticate, isAdmin, listPendingUsers);
router.put('/approve-user/:id', authenticate, isAdmin, approveUser);
router.put('/reject-user/:id', authenticate, isAdmin, rejectUser);

// Admin-only: List all users and delete user
router.get('/users', authenticate, isAdmin, listAllUsers);
router.delete('/delete-user/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
