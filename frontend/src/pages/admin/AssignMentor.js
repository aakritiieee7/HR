import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignMentor = () => {
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mentorId, setMentorId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/projects?status=pending', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setInterns(res.data.projects.map(p => p.intern_id)))
      .catch(() => setInterns([]));
    axios.get('/api/admin/mentors', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMentors(res.data.mentors))
      .catch(() => setMentors([]));
  }, []);

  const handleAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/assign-mentor', {
        internId: selected._id,
        mentorId,
        projectTitle,
        projectDescription,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Mentor assigned!');
    } catch {
      setMessage('Error assigning mentor');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Mentor</h2>
      <div className="mb-4">
        <label>Select Intern:</label>
        <select className="w-full border p-2 rounded" onChange={e => setSelected(interns.find(i => i._id === e.target.value))}>
          <option value="">-- Select --</option>
          {interns.map(i => <option key={i._id} value={i._id}>{i.name} ({i.email})</option>)}
        </select>
      </div>
      {selected && (
        <>
          <div className="mb-4">
            <label>Select Mentor:</label>
            <select className="w-full border p-2 rounded" value={mentorId} onChange={e => setMentorId(e.target.value)}>
              <option value="">-- Select --</option>
              {mentors.map(m => <option key={m._id} value={m._id}>{m.username} ({m.department})</option>)}
            </select>
          </div>
          <div className="mb-4">
            <input className="w-full border p-2 rounded" placeholder="Project Title" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
          </div>
          <div className="mb-4">
            <input className="w-full border p-2 rounded" placeholder="Project Description" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAssign}>Assign Mentor</button>
        </>
      )}
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
};

export default AssignMentor; 