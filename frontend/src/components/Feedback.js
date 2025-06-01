// frontend/src/components/Feedback.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    comments: '',
  });
  const [message, setMessage] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/api/feedback');
      setFeedbacks(res.data);
    } catch (err) {
      setMessage('Failed to load feedback');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedback', formData);
      setMessage('Feedback submitted!');
      setFormData({ user: '', comments: '' });
      fetchFeedbacks();
    } catch {
      setMessage('Failed to submit feedback');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-md bg-white rounded">
      <h2 className="text-2xl font-bold mb-4">Feedback</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="user"
          placeholder="Your Name"
          value={formData.user}
          onChange={handleChange}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <textarea
          name="comments"
          placeholder="Your Feedback"
          value={formData.comments}
          onChange={handleChange}
          rows={4}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <h3 className="text-xl font-semibold mb-3">All Feedback:</h3>
      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <ul className="space-y-3">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="p-3 border rounded bg-gray-50">
              <strong>{fb.user}</strong> says:<br />
              <p>{fb.comments}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feedback;
