import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectDetails = () => {
  const [tab, setTab] = useState('ongoing');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/admin/projects?status=${tab}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProjects(res.data.projects))
      .catch(() => setProjects([]));
  }, [tab]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex space-x-4 mb-4">
        <button className={`px-4 py-2 rounded ${tab==='ongoing'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setTab('ongoing')}>Ongoing</button>
        <button className={`px-4 py-2 rounded ${tab==='completed'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setTab('completed')}>Completed</button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Intern</th>
            <th className="p-2">Mentor</th>
            <th className="p-2">Project</th>
            <th className="p-2">Status</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.intern_id?.name}</td>
              <td className="p-2">{p.mentor_id?.username}</td>
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.status}</td>
              <td className="p-2">{p.start_date ? new Date(p.start_date).toLocaleDateString() : ''}</td>
              <td className="p-2">{p.end_date ? new Date(p.end_date).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDetails; 