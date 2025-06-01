import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

const StudentLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/student/login`,
        credentials
      );

      if (res.data.success) {
        alert('Login successful');
        navigate('/student/dashboard');
      } else {
        alert('Login failed: ' + (res.data.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const fields = [
    { name: 'usn', type: 'text', placeholder: 'USN' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onSubmit={handleLogin} fields={fields} />
    </div>
  );
};

export default StudentLogin;
