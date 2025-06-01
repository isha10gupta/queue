// frontend/src/components/VendorDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/vendor/jobs');
      setPrintJobs(res.data.jobs);
    } catch (err) {
      setMessage('Failed to load jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const markDone = async (jobId) => {
    try {
      await axios.post(`/api/vendor/jobs/${jobId}/done`);
      fetchJobs();
    } catch {
      setMessage('Failed to mark job as done');
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`/api/vendor/jobs/${jobId}`);
      fetchJobs();
    } catch {
      setMessage('Failed to delete job');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 shadow-md bg-white rounded">
      <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
      {message && <div className="text-red-600 mb-4">{message}</div>}
      {printJobs.length === 0 ? (
        <p>No pending print jobs</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Student USN</th>
              <th className="border border-gray-300 p-2">Shop</th>
              <th className="border border-gray-300 p-2">Pages</th>
              <th className="border border-gray-300 p-2">Print Types</th>
              <th className="border border-gray-300 p-2">Google Drive Link</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {printJobs.map(job => (
              <tr key={job.id}>
                <td className="border border-gray-300 p-2">{job.studentUsn}</td>
                <td className="border border-gray-300 p-2">{job.shop}</td>
                <td className="border border-gray-300 p-2">{job.pages}</td>
                <td className="border border-gray-300 p-2">{job.printType.join(', ')}</td>
                <td className="border border-gray-300 p-2">
                  <a href={job.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View File
                  </a>
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => markDone(job.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorDashboard;
