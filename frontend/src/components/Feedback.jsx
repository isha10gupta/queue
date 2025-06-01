// frontend/src/components/Feedback.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      // Replace this URL with your backend feedback endpoint
      const res = await axios.post('/api/feedback', formData);

      if (res.data.success) {
        setStatus('Feedback submitted successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to submit feedback.');
      }
    } catch (error) {
      setStatus('Error submitting feedback.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Send us your Feedback</h2>

        <label className="block mb-2 font-semibold" htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold" htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold" htmlFor="message">Message</label>
        <textarea
          name="message"
          id="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded resize-none"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>

        {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
      </form>
    </div>
  );
};

export default Feedback;
