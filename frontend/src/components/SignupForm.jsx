// frontend/src/components/SignupForm.js
import React, { useState } from 'react';

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    phone: '',
    password: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <input
        name="name"
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="block w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="usn"
        type="text"
        placeholder="USN"
        value={formData.usn}
        onChange={handleChange}
        className="block w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="block w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="block w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="block w-full mb-6 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
