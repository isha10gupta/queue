import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [message, setMessage] = useState('');
  const vendorId = localStorage.getItem('vendorId') || 1;

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/queue/printjob/vendor/${vendorId}`);
      setPrintJobs(res.data.jobs);

      const earningsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/queue/earnings/${vendorId}/today`);
      setEarnings(earningsRes.data.earnings || 0);
    } catch (err) {
      setMessage('❌ Failed to load jobs');
    }
  };

  const markDone = async (jobId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/queue/printjob/${jobId}/done`);
      fetchJobs(); // auto-refresh on mark done
    } catch {
      setMessage('❌ Failed to mark job as done');
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/queue/printjob/${jobId}`);
      fetchJobs();
    } catch {
      setMessage('❌ Failed to delete job');
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // auto refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 shadow-md bg-white rounded">
      <h2 className="text-2xl font-bold mb-4">🏪 Vendor Dashboard</h2>
      <p className="text-lg text-green-700 mb-3">Today's Earnings: ₹{earnings}</p>

      {message && <div className="text-red-600 mb-4">{message}</div>}

      {printJobs.length === 0 ? (
        <p>No pending print jobs</p>
      ) : (
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Pages</th>
              <th className="border p-2">Print Types</th>
              <th className="border p-2">File Link</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {printJobs.map(job => (
              <tr key={job.id}>
                <td className="border p-2">{job.student_name || `#${job.student_id}`}</td>
                <td className="border p-2">{job.pages || '—'}</td>
                <td className="border p-2">
                  {job.printType ? JSON.parse(job.printType).join(', ') : '—'}
                </td>
                <td className="border p-2">
                  <a href={job.file_name} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View File
                  </a>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => markDone(job.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
