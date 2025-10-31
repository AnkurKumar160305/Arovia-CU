const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, sendOTP } = require('../utils/otpService');

const router = express.Router();

// Send OTP for signup/login
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !mobile.match(/^\+91\d{10}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid mobile number' 
      });
    }

    // Delete existing OTPs for this mobile
    await OTP.deleteMany({ mobile });

    // For testing, always use OTP 2004
    const otp = '2004';
    
    // Save OTP to database
    const otpDoc = new OTP({
      mobile,
      otp
    });
    await otpDoc.save();

    // In production, you would send actual SMS here
    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      testOTP: otp // Remove this in production
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP' 
    });
  }
});

// Verify OTP and signup
router.post('/signup', async (req, res) => {
  try {
    const { name, mobile, age, otp, location } = req.body;

    // Validate input
    if (!name || !mobile || !age || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({ mobile, otp });
    if (!otpDoc) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this mobile number' 
      });
    }

    // Create new user
    const user = new User({
      name,
      mobile,
      age,
      isVerified: true,
      location
    });

    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpDoc._id });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});

// Verify OTP and login
router.post('/login', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Validate input
    if (!mobile || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mobile number and OTP are required' 
      });
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({ mobile, otp });
    if (!otpDoc) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    // Find user
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please sign up first.' 
      });
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpDoc._id });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

module.exports = router;