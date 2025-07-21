import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import AddMentor from './admin/AddMentor';
import AddIntern from './admin/AddIntern';
import AssignMentor from './admin/AssignMentor';
import ProjectDetails from './admin/ProjectDetails';
import IssueCertificate from './admin/IssueCertificate';
import Analytics from './admin/Analytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-blue-700 p-4 text-white">
        <div className="font-bold text-xl">Admin Dashboard</div>
        <div className="space-x-4">
          <Link to="add-mentor" className="hover:underline">Add Mentor</Link>
          <Link to="add-intern" className="hover:underline">Add Intern</Link>
          <Link to="assign-mentor" className="hover:underline">Assign Mentor</Link>
          <Link to="projects" className="hover:underline">Project Details</Link>
          <Link to="issue-certificate" className="hover:underline">Issue Certificate</Link>
          <Link to="analytics" className="hover:underline">Analytics</Link>
          <button onClick={handleLogout} className="ml-4 bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      </nav>
      <div className="p-6">
        <Routes>
          <Route path="add-mentor" element={<AddMentor />} />
          <Route path="add-intern" element={<AddIntern />} />
          <Route path="assign-mentor" element={<AssignMentor />} />
          <Route path="projects" element={<ProjectDetails />} />
          <Route path="issue-certificate" element={<IssueCertificate />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<div>Welcome, Admin!</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard; 