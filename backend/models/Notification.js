const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: false
  },
  userEmail: {
    type: String,
    required: false
  },
  type: {
    type: String,
    default: 'general'
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: false
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
