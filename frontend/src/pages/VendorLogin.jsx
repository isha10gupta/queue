import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

const VendorLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
   const res = await axios.post('http://localhost:3000/api/auth/student/login', credentials);


      if (res.data.success) {
        alert('Login successful');
        navigate('/vendor/dashboard');
      } else {
        alert('Login failed: ' + (res.data.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const fields = [
    { name: 'username', type: 'text', placeholder: 'Username' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onSubmit={handleLogin} fields={fields} />
    </div>
  );
};

export default VendorLogin;
