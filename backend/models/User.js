const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: '', // empty if Google user
  },
  name: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  dob: {
    dd: String,
    mm: String,
    yyyy: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  about: {
    type: String,
    maxlength: 200,
  },
  phone: {
    type: String,
    match: [/^\+923\d{9}$/, 'Invalid phone format'],
  },

  favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
  },
],
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
