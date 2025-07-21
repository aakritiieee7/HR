import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompletedProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/mentor/projects?status=completed', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProjects(res.data.projects))
      .catch(() => setProjects([]));
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Completed Projects</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Intern</th>
            <th className="p-2">Project</th>
            <th className="p-2">Remarks</th>
            <th className="p-2">Attendance</th>
            <th className="p-2">End Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.intern_id?.name}</td>
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.remarks}</td>
              <td className="p-2">{p.attendance}</td>
              <td className="p-2">{p.end_date ? new Date(p.end_date).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedProjects; 