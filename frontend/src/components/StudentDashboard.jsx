// frontend/src/components/StudentDashboard.js
import React, { useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    driveLink: '',
    pages: '',
    printType: [],
    shop: '',
  });
  const [estimatedTime, setEstimatedTime] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, printType: [...formData.printType, value] });
    } else {
      setFormData({
        ...formData,
        printType: formData.printType.filter((type) => type !== value),
      });
    }
  };

  const handleEstimate = async () => {
    try {
      const res = await axios.get(`/api/queue/estimate?shop=${formData.shop}`);
      setEstimatedTime(res.data.estimatedTime);
    } catch (err) {
      setEstimatedTime('Error estimating time');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/queue/submit', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Failed to submit print request');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-md bg-white rounded">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="driveLink"
          placeholder="Google Drive Link"
          className="block w-full mb-3 p-2 border"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pages"
          placeholder="Number of Pages"
          className="block w-full mb-3 p-2 border"
          onChange={handleChange}
          required
        />
        <select
          name="shop"
          className="block w-full mb-3 p-2 border"
          onChange={handleChange}
          required
        >
          <option value="">Select Shop</option>
          <option value="Shop1">Shop 1</option>
          <option value="Shop2">Shop 2</option>
          <option value="Shop3">Shop 3</option>
          <option value="Shop4">Shop 4</option>
          <option value="Shop5">Shop 5</option>
        </select>

        <div className="mb-3">
          <label className="mr-2">Print Type:</label>
          <label className="mr-2">
            <input type="checkbox" value="Black & White" onChange={handleCheckboxChange} /> Black & White
          </label>
          <label className="mr-2">
            <input type="checkbox" value="Color" onChange={handleCheckboxChange} /> Color
          </label>
          <label>
            <input type="checkbox" value="Side by Side" onChange={handleCheckboxChange} /> Side by Side
          </label>
        </div>

        <button type="button" className="bg-yellow-600 text-white px-4 py-2 rounded mr-3" onClick={handleEstimate}>
          Estimate Time
        </button>
        {estimatedTime && <div className="text-blue-600 mb-3">Estimated Time: {estimatedTime}</div>}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit Print Request
        </button>
        {message && <div className="text-green-600 mt-3">{message}</div>}
      </form>
    </div>
  );
};

export default StudentDashboard;
