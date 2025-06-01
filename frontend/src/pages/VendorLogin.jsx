import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

const VendorLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/vendor/login`,
        credentials
      );

      // ✅ Defensive check for backend response
      const vendor = res.data?.vendor;

      if (res.data.success && vendor?.id) {
        localStorage.setItem('vendorId', vendor.id);
        localStorage.setItem('vendorName', vendor.email); // Optional for greeting
        alert('Login successful');
        navigate('/vendor/dashboard');
      } else {
        alert('Login failed: ' + (res.data.message || 'Invalid credentials'));
      }
    } catch (err) {
      console.error('Vendor login error:', err);
      alert('Login error: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const fields = [
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onSubmit={handleLogin} fields={fields} />
    </div>
  );
};

export default VendorLogin;
