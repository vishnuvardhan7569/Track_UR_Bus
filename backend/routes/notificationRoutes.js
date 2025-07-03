const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// Get all notifications (all authenticated users)
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Create a new notification (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { busNumber, message } = req.body;
    
    if (!busNumber || !message) {
      return res.status(400).json({ message: 'Bus number and message are required' });
    }

    const newNotification = new Notification({
      busNumber,
      message
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
});

// Delete a notification (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
});

// Get notifications for a specific bus (for users)
router.get('/bus/:busNumber', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ busNumber: req.params.busNumber })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

module.exports = router; 