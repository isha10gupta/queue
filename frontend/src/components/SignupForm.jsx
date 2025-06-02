import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SignupForm = ({ onSubmit }) => {
  const { dark } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm p-8 rounded shadow-lg ${
          dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className={`block w-full mb-4 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          required
        />
        <input
          name="usn"
          type="text"
          placeholder="USN"
          value={formData.usn}
          onChange={handleChange}
          className={`block w-full mb-4 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={`block w-full mb-4 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`block w-full mb-4 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`block w-full mb-6 p-2 border rounded ${
            dark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-black border-gray-300'
          }`}
          required
        />

        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold ${
            dark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
