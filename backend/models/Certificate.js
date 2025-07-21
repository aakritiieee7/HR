const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  intern_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  issue_date: { type: Date, default: Date.now },
  certificate_path: { type: String },
});

module.exports = mongoose.model('Certificate', certificateSchema); 