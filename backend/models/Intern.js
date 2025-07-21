const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], default: [] },
  department: { type: String },
  status: { type: String, enum: ['pending', 'ongoing', 'completed'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Intern', internSchema); 