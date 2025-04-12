// routes/userRoutes.js

const express = require('express');
const { updateProfile, updatePreferences, getCurrentUser } = require('../controllers/userController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(isAuthenticated);

// Get current user profile
router.get('/profile', getCurrentUser);

// Update user profile
router.put('/profile', updateProfile);

// Update user preferences
router.put('/preferences', updatePreferences);

module.exports = router;