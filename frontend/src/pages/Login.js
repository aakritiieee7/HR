import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (role === 'admin') window.location.href = '/admin';
      else window.location.href = '/mentor';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">DRDO HR Login</h2>
        <div className="mb-4">
          <label className="block mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded p-2">
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded p-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded p-2" required />
        </div>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

export default Login; 