// controllers/userController.js

const User = require('../models/User');

// Update user profile
const updateProfile = async (req, res) => {
  const { name } = req.body;
  const userId = req.session.user?.id || req.user._id;

  try {
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;

    // Save the updated user
    await user.save();

    // Update session with new data
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    };

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  const { stockCategories } = req.body;
  const userId = req.session.user?.id || req.user._id;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update preferences
    user.preferences = {
      ...(user.preferences || {}),
      stockCategories: stockCategories || [],
      lastUpdated: Date.now()
    };

    await user.save();

    res.status(200).json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get current user data
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.session.user?.id || req.user._id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        preferences: user.preferences
      } 
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  updateProfile,
  updatePreferences,
  getCurrentUser
};