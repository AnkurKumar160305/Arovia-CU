const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user profile' 
    });
  }
});

// Update user location
router.put('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, address, ipAddress } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        location: {
          latitude,
          longitude,
          address,
          ipAddress
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      user
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update location' 
    });
  }
});

// Update user language
router.put('/language', authenticateToken, async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'hi'].includes(language)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid language selection' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { language },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Language updated successfully',
      user
    });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update language' 
    });
  }
});

module.exports = router;