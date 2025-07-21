import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import NewRequests from './mentor/NewRequests';
import OngoingProjects from './mentor/OngoingProjects';
import CompletedProjects from './mentor/CompletedProjects';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-green-700 p-4 text-white">
        <div className="font-bold text-xl">Mentor Dashboard</div>
        <div className="space-x-4">
          <Link to="new-requests" className="hover:underline">New Intern Requests</Link>
          <Link to="ongoing-projects" className="hover:underline">Ongoing Projects</Link>
          <Link to="completed-projects" className="hover:underline">Completed Projects</Link>
          <button onClick={handleLogout} className="ml-4 bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      </nav>
      <div className="p-6">
        <Routes>
          <Route path="new-requests" element={<NewRequests />} />
          <Route path="ongoing-projects" element={<OngoingProjects />} />
          <Route path="completed-projects" element={<CompletedProjects />} />
          <Route path="*" element={<div>Welcome, Mentor!</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default MentorDashboard; 