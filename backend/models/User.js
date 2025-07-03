const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'driver'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: function() {
        return this.role === 'student' ? 'approved' : 'pending';
      },
    },
    requestedRole: {
      type: String,
      enum: ['admin', 'driver'],
      default: null,
    },
    approvalNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);
