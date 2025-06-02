import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const VendorLogin = () => {
  const { dark } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/vendor/login', {
        email,
        password,
      });

      if (res.data && res.data.vendor) {
        localStorage.setItem('vendorId', res.data.vendor.id);
        navigate('/vendor/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-sm p-8 rounded shadow-lg ${
          dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Vendor Login
        </h2>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Vendor Email"
          className={`w-full mb-4 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={`w-full mb-6 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold ${
            dark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default VendorLogin;
