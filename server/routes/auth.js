const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

// Test connection endpoint (no auth required)
router.get('/test-connection', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API connection successful',
    serverTime: new Date().toISOString(),
    corsOrigins: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'Not configured'
  });
});

module.exports = router;