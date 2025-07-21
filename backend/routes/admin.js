const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Intern = require('../models/Intern');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');
const multer = require('multer');
const pdfkit = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const csv = require('csv-parse');
const xlsx = require('xlsx');

const upload = multer({ dest: 'uploads/' });

// Add Mentor
router.post('/add-mentor', auth('admin'), async (req, res) => {
  const { name, email, department, phone } = req.body;
  const username = email.split('@')[0];
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashed = await bcrypt.hash(tempPassword, 10);
  const mentor = new User({
    username,
    password: hashed,
    role: 'mentor',
    email,
    department,
    phone,
    tempPassword: true,
  });
  await mentor.save();
  // In production, send email with credentials
  res.json({ message: 'Mentor added', mentor: { ...mentor.toObject(), tempPassword } });
});

// Add Intern (web form)
router.post('/add-intern', auth('admin'), async (req, res) => {
  const { name, email, skills, department } = req.body;
  const intern = new Intern({ name, email, skills, department });
  await intern.save();
  res.json({ message: 'Intern added', intern });
});

// Bulk add interns (CSV/Excel)
router.post('/add-interns-bulk', auth('admin'), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filePath = req.file.path;
  let interns = [];
  try {
    if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      // Parse CSV
      const fs = require('fs');
      const data = fs.readFileSync(filePath);
      csv.parse(data, { columns: true, trim: true }, async (err, records) => {
        if (err) return res.status(400).json({ message: 'CSV parse error' });
        for (const r of records) {
          if (r.name && r.email) {
            const intern = new Intern({
              name: r.name,
              email: r.email,
              skills: r.skills ? r.skills.split(',').map(s => s.trim()) : [],
              department: r.department || '',
            });
            await intern.save();
            interns.push(intern);
          }
        }
        res.json({ message: 'Interns added', count: interns.length });
      });
    } else if (req.file.mimetype.includes('excel') || req.file.originalname.endsWith('.xlsx')) {
      // Parse Excel
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = xlsx.utils.sheet_to_json(sheet);
      for (const r of records) {
        if (r.name && r.email) {
          const intern = new Intern({
            name: r.name,
            email: r.email,
            skills: r.skills ? r.skills.split(',').map(s => s.trim()) : [],
            department: r.department || '',
          });
          await intern.save();
          interns.push(intern);
        }
      }
      res.json({ message: 'Interns added', count: interns.length });
    } else {
      res.status(400).json({ message: 'Unsupported file type' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Bulk upload error', error: err.message });
  }
});

// Assign Mentor to Intern
router.post('/assign-mentor', auth('admin'), async (req, res) => {
  const { internId, mentorId, projectTitle, projectDescription } = req.body;
  const intern = await Intern.findById(internId);
  if (!intern) return res.status(404).json({ message: 'Intern not found' });
  intern.mentor_id = mentorId;
  intern.status = 'ongoing';
  await intern.save();
  const project = new Project({
    intern_id: internId,
    mentor_id: mentorId,
    title: projectTitle,
    description: projectDescription,
    status: 'ongoing',
    start_date: new Date(),
  });
  await project.save();
  res.json({ message: 'Mentor assigned', project });
});

// View Ongoing/Completed Projects
router.get('/projects', auth('admin'), async (req, res) => {
  const { status } = req.query; // 'ongoing' or 'completed'
  const projects = await Project.find(status ? { status } : {})
    .populate('intern_id')
    .populate('mentor_id');
  res.json({ projects });
});

// Issue Certificate
router.post('/issue-certificate', auth('admin'), async (req, res) => {
  const { internId, projectId } = req.body;
  const intern = await Intern.findById(internId);
  const project = await Project.findById(projectId);
  if (!intern || !project) return res.status(404).json({ message: 'Not found' });
  // Generate PDF
  const certPath = path.join(__dirname, `../certificates/certificate_${internId}_${projectId}.pdf`);
  const doc = new pdfkit();
  doc.pipe(fs.createWriteStream(certPath));
  doc.fontSize(24).text('DRDO Internship Certificate', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`This is to certify that ${intern.name} has successfully completed the internship in ${intern.department}.`);
  doc.text(`Project: ${project.title}`);
  doc.text(`Mentor: ${project.mentor_id}`);
  doc.text(`Duration: ${project.start_date.toDateString()} - ${project.end_date ? project.end_date.toDateString() : 'Ongoing'}`);
  doc.end();
  // Save certificate record
  const cert = new Certificate({ intern_id: internId, project_id: projectId, certificate_path: certPath });
  await cert.save();
  res.json({ message: 'Certificate issued', cert });
});

// Analytics stats
router.get('/analytics', auth('admin'), async (req, res) => {
  const interns = await Intern.countDocuments();
  const mentors = await User.countDocuments({ role: 'mentor' });
  const ongoing = await Project.countDocuments({ status: 'ongoing' });
  const completed = await Project.countDocuments({ status: 'completed' });
  res.json({ interns, mentors, ongoing, completed });
});

module.exports = router; 