const express = require('express');
const router = express.Router();
const { loginUser, registerUser, checkUserStatus } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/check-status', checkUserStatus);

module.exports = router;
