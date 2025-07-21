const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  intern_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date },
  attendance: { type: Number },
  remarks: { type: String },
});

module.exports = mongoose.model('Project', projectSchema); 