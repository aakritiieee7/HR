const express = require('express');
const Intern = require('../models/Intern');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// View new intern requests (assigned but not accepted)
router.get('/new-requests', auth('mentor'), async (req, res) => {
  const mentorId = req.user.id;
  const interns = await Intern.find({ mentor_id: mentorId, status: 'ongoing' });
  res.json({ interns });
});

// Accept intern (assign project title)
router.post('/accept-intern', auth('mentor'), async (req, res) => {
  const { internId, projectTitle } = req.body;
  const intern = await Intern.findById(internId);
  if (!intern) return res.status(404).json({ message: 'Intern not found' });
  intern.status = 'ongoing';
  await intern.save();
  const project = await Project.findOne({ intern_id: internId, mentor_id: req.user.id });
  if (project) {
    project.title = projectTitle;
    await project.save();
  }
  res.json({ message: 'Intern accepted', intern });
});

// Reject intern (assign another mentor)
router.post('/reject-intern', auth('mentor'), async (req, res) => {
  const { internId, remarks, newMentorId } = req.body;
  const intern = await Intern.findById(internId);
  if (!intern) return res.status(404).json({ message: 'Intern not found' });
  intern.mentor_id = newMentorId;
  intern.status = 'pending';
  await intern.save();
  res.json({ message: 'Intern reassigned', intern });
});

// Complete project
router.post('/complete-project', auth('mentor'), async (req, res) => {
  const { projectId, remarks, attendance } = req.body;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  project.status = 'completed';
  project.end_date = new Date();
  project.remarks = remarks;
  project.attendance = attendance;
  await project.save();
  res.json({ message: 'Project completed', project });
});

// View ongoing/completed projects
router.get('/projects', auth('mentor'), async (req, res) => {
  const { status } = req.query;
  const projects = await Project.find({ mentor_id: req.user.id, ...(status ? { status } : {}) })
    .populate('intern_id');
  res.json({ projects });
});

module.exports = router; 