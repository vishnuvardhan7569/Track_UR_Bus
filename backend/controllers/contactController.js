const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

exports.replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.reply = reply;
    contact.status = 'replied';
    contact.repliedAt = new Date();
    await contact.save();
    // Create a notification for the user
    const notification = await Notification.create({
      userEmail: contact.email,
      type: 'contact-reply',
      contactId: contact._id,
      message: `Reply to your contact submission: ${reply}`
    });
    res.json({ message: 'Reply sent', contact });
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ message: 'Error sending reply', error: err.message });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.reply = '';
    contact.status = 'read';
    contact.repliedAt = null;
    await contact.save();
    // Delete related notifications
    await Notification.deleteMany({ contactId: contact._id, type: 'contact-reply' });
    res.json({ message: 'Reply deleted', contact });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reply', error: err.message });
  }
}; 