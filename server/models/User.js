const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+91\d{10}$/, 'Please enter a valid mobile number']
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  role: {
    type: String,
    enum: ['user', 'doctor', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    ipAddress: String
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);