import React, { useState } from 'react';
import axios from 'axios';

const AddIntern = () => {
  const [form, setForm] = useState({ name: '', email: '', skills: '', department: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const skillsArr = form.skills.split(',').map(s => s.trim());
      await axios.post('/api/admin/add-intern', { ...form, skills: skillsArr }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Intern added!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding intern');
      setMessage('');
    }
  };

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleFileUpload = async e => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/add-interns-bulk', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Interns uploaded!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading interns');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Intern</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Intern</button>
      </form>
      <div className="my-6 border-t pt-4">
        <h3 className="font-bold mb-2">Bulk Upload (CSV/Excel)</h3>
        <form onSubmit={handleFileUpload} className="space-y-2">
          <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Upload File</button>
        </form>
      </div>
      {message && <div className="text-green-600 mt-2">{message}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default AddIntern; 