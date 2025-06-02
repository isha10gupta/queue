import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const LoginForm = ({ onSubmit, fields }) => {
  const { dark } = useContext(ThemeContext);

  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <form
        onSubmit={handleSubmit}
        className={`p-8 w-full max-w-sm rounded shadow-lg ${
          dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {dark ? '👩‍🎓' : '🧑‍🎓'} Student Login
        </h2>

        {fields.map(({ name, type, placeholder }) => (
          <input
            key={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full mb-4 p-2 border rounded ${
              dark
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                : 'bg-white text-black border-gray-300'
            }`}
            required
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          } ${dark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
