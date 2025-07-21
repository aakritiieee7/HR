const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'mentor'], required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  created_at: { type: Date, default: Date.now },
  phone: { type: String },
  tempPassword: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema); 