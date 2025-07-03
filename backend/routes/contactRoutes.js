const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const Contact = require('../models/Contact');
const { replyToContact, deleteReply } = require('../controllers/contactController');

// Submit contact form (public route)
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting contact form', error: err.message });
  }
});

// Get all contact submissions (admin only)
router.get('/all', authenticate, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ timestamp: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contacts', error: err.message });
  }
});

// Mark contact as read (admin only)
router.put('/:id/read', authenticate, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact', error: err.message });
  }
});

// Mark contact as replied (admin only)
router.put('/:id/replied', authenticate, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'replied' },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact', error: err.message });
  }
});

// Delete contact submission (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting contact', error: err.message });
  }
});

// Reply to contact (admin only)
router.put('/:id/reply', replyToContact);

// Delete reply from contact (admin only)
router.put('/:id/delete-reply', deleteReply);

module.exports = router; 