const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, deleteFeedback } = require('../controllers/feedbackController');

// Public: Submit feedback
router.post('/', submitFeedback);
// Admin: Get all feedback
router.get('/', getAllFeedback);
// Admin: Delete feedback
router.delete('/:id', deleteFeedback);

module.exports = router; 