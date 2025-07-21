import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OngoingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [attendance, setAttendance] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/mentor/projects?status=ongoing', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProjects(res.data.projects))
      .catch(() => setProjects([]));
  }, []);

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/mentor/complete-project', {
        projectId: selected._id,
        remarks,
        attendance,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Project marked as completed!');
    } catch {
      setMessage('Error completing project');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ongoing Projects</h2>
      <div className="mb-4">
        <label>Select Project:</label>
        <select className="w-full border p-2 rounded" onChange={e => setSelected(projects.find(p => p._id === e.target.value))}>
          <option value="">-- Select --</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.intern_id?.name} - {p.title}</option>)}
        </select>
      </div>
      {selected && (
        <>
          <div className="mb-4">
            <input className="w-full border p-2 rounded" placeholder="Remarks (optional)" value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
          <div className="mb-4">
            <input className="w-full border p-2 rounded" placeholder="Attendance (%)" value={attendance} onChange={e => setAttendance(e.target.value)} required />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleComplete}>Mark as Completed</button>
        </>
      )}
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
};

export default OngoingProjects; 