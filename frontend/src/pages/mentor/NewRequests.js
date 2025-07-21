import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewRequests = () => {
  const [interns, setInterns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [remarks, setRemarks] = useState('');
  const [newMentorId, setNewMentorId] = useState('');
  const [mentors, setMentors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/mentor/new-requests', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setInterns(res.data.interns))
      .catch(() => setInterns([]));
    axios.get('/api/admin/mentors', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMentors(res.data.mentors))
      .catch(() => setMentors([]));
  }, []);

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/mentor/accept-intern', {
        internId: selected._id,
        projectTitle,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Intern accepted!');
    } catch {
      setMessage('Error accepting intern');
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/mentor/reject-intern', {
        internId: selected._id,
        remarks,
        newMentorId,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Intern reassigned!');
    } catch {
      setMessage('Error rejecting intern');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">New Intern Requests</h2>
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
            <input className="w-full border p-2 rounded" placeholder="Project Title" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded mr-2" onClick={handleAccept}>Accept</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => document.getElementById('rejectModal').showModal()}>Reject</button>
        </>
      )}
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {/* Reject Modal */}
      <dialog id="rejectModal" className="rounded p-4">
        <h3 className="font-bold mb-2">Reject Intern</h3>
        <textarea className="w-full border p-2 rounded mb-2" placeholder="Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} required />
        <select className="w-full border p-2 rounded mb-2" value={newMentorId} onChange={e => setNewMentorId(e.target.value)} required>
          <option value="">Assign Another Mentor</option>
          {mentors.map(m => <option key={m._id} value={m._id}>{m.username} ({m.department})</option>)}
        </select>
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-300 px-3 py-1 rounded" onClick={()=>document.getElementById('rejectModal').close()}>Cancel</button>
          <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleReject}>Reject</button>
        </div>
      </dialog>
    </div>
  );
};

export default NewRequests; 