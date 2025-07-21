import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({ interns: 0, mentors: 0, ongoing: 0, completed: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data))
      .catch(() => setStats({ interns: 0, mentors: 0, ongoing: 0, completed: 0 }));
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.interns}</div>
          <div>Total Interns</div>
        </div>
        <div className="bg-green-100 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.mentors}</div>
          <div>Total Mentors</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.ongoing}</div>
          <div>Ongoing Projects</div>
        </div>
        <div className="bg-purple-100 p-4 rounded text-center">
          <div className="text-2xl font-bold">{stats.completed}</div>
          <div>Completed Projects</div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded text-center">[Charts Coming Soon]</div>
    </div>
  );
};

export default Analytics; 