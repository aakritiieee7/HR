import React, { useState } from 'react';
import axios from 'axios';

const AddMentor = () => {
  const [form, setForm] = useState({ name: '', email: '', department: '', phone: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/add-mentor', form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(`Mentor added! Temp password: ${res.data.mentor.tempPassword}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding mentor');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Mentor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Mentor</button>
      </form>
      {message && <div className="text-green-600 mt-2">{message}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default AddMentor; 