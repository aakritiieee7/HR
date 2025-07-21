import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IssueCertificate = () => {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');
  const [cert, setCert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/projects?status=completed', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProjects(res.data.projects))
      .catch(() => setProjects([]));
  }, []);

  const handleIssue = async () => {
    try {
      const token = localStorage.getItem('token');
      const project = projects.find(p => p._id === selected);
      const res = await axios.post('/api/admin/issue-certificate', {
        internId: project.intern_id._id,
        projectId: project._id,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setCert(res.data.cert);
      setMessage('Certificate issued!');
    } catch {
      setMessage('Error issuing certificate');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Issue Certificate</h2>
      <div className="mb-4">
        <label>Select Completed Project:</label>
        <select className="w-full border p-2 rounded" value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">-- Select --</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.intern_id?.name} - {p.title}</option>
          ))}
        </select>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleIssue}>Issue Certificate</button>
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {cert && <a href={cert.certificate_path} className="block mt-2 text-blue-700 underline">Download Certificate</a>}
    </div>
  );
};

export default IssueCertificate; 