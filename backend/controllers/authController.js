const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use a fallback JWT secret if environment variable is not set
const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_jwt_secret_key_for_bus_tracker_2024';

exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Block login if not approved
    if (user.status !== 'approved') {
      return res.status(403).json({ msg: 'Your account is awaiting admin approval.' });
    }

    // Check if role matches
    if (role && user.role !== role) {
      return res.status(401).json({ msg: `Incorrect role selected. Please log in as a ${user.role}.` });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with token and limited user data
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login', error: err.message });
  }
};

// controllers/authController.js
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine status and requestedRole
    let status = 'approved';
    let requestedRole = null;
    let finalRole = role || 'student';
    if (role === 'driver' || role === 'admin') {
      status = 'pending';
      requestedRole = role;
      finalRole = 'student'; // Always use a valid enum value
    }

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      status,
      requestedRole
    });

    await newUser.save();

    if (status === 'pending') {
      return res.status(201).json({ msg: 'Registration request sent. Please wait for admin approval.' });
    }
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    // Prevent role change via this endpoint
    if (updates.role) delete updates.role;
    // If password is being updated, hash it
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// List all pending users (admin only)
exports.listPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' }).select('-password');
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending users', error: err.message });
  }
};

// Approve a pending user (admin only)
exports.approveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const note = req.body.note || '';
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status !== 'pending') return res.status(400).json({ message: 'User is not pending approval' });
    user.status = 'approved';
    if (user.requestedRole) user.role = user.requestedRole;
    user.requestedRole = null;
    user.approvalNote = note;
    await user.save();
    res.json({ message: 'User approved', user });
  } catch (err) {
    res.status(500).json({ message: 'Error approving user', error: err.message });
  }
};

// Reject a pending user (admin only)
exports.rejectUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const note = req.body.note || '';
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status !== 'pending') return res.status(400).json({ message: 'User is not pending approval' });
    user.status = 'rejected';
    user.approvalNote = note;
    await user.save();
    res.json({ message: 'User rejected', user });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting user', error: err.message });
  }
};

// List all users (admin only)
exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Check user status by email
exports.checkUserStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ status: user.status, role: user.requestedRole || user.role });
  } catch (err) {
    res.status(500).json({ msg: 'Error checking user status', error: err.message });
  }
};
