const express = require('express');
const router = express.Router();

// Register
router.get('/register', (req, res) => {
  res.send('REGISTER');
});

// Authenticate
router.post('/authenticate', (req, res) => {
  res.send('authenticate');
});

// Profile
router.get('/profile', (req, res) => {
  res.send('profile');
});

// Validate - check if token matches
router.get('/validate', (req, res) => {
  res.send('validate');
});

module.exports = router;
