import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FeedbackViewer({ vendorId }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/vendor/feedbacks?vendor_id=${vendorId}`)
      .then((res) => setFeedbacks(res.data.feedbacks))
      .catch(() => setFeedbacks([]));
  }, [vendorId]);

  return (
    <div className="mt-6 p-4 border rounded shadow bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600">
      <h2 className="text-xl font-bold mb-3">📬 Student Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No feedbacks yet.</p>
      ) : (
        <ul className="space-y-3">
          {feedbacks.map((f) => (
            <li key={f.id} className="p-2 border rounded dark:border-gray-600">
              <p className="font-medium">From: {f.student_usn}</p>
              <p className="italic text-gray-700 dark:text-gray-300">{f.message}</p>
              <p className="text-sm text-gray-400">{new Date(f.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const VendorDashboard = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [message, setMessage] = useState('');
  const vendorId = localStorage.getItem('vendorId') || 1;

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/queue/printjob/vendor/${vendorId}`
      );
      setPrintJobs(res.data.jobs);

      const earningsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/queue/earnings/${vendorId}/total`
      );
      setEarnings(earningsRes.data.earnings || 0);
    } catch {
      setMessage('❌ Failed to load jobs');
    }
  };

  const markDone = async (jobId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/queue/printjob/${jobId}/done`);
      await fetchJobs();
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
    const interval = setInterval(fetchJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 shadow-md bg-white dark:bg-gray-900 dark:text-white rounded">
      <h2 className="text-2xl font-bold mb-4">🏪 Vendor Dashboard</h2>
      <p className="text-lg text-green-600 dark:text-green-400 mb-3">
        Total Earnings: ₹{earnings}
      </p>

      {message && <div className="text-red-600 mb-4">{message}</div>}

      {printJobs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No pending print jobs</p>
      ) : (
        <table className="w-full border border-collapse border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border p-2 dark:border-gray-600">Student Name</th>
              <th className="border p-2 dark:border-gray-600">Pages</th>
              <th className="border p-2 dark:border-gray-600">Print Types</th>
              <th className="border p-2 dark:border-gray-600">File Link</th>
              <th className="border p-2 dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {printJobs.map((job) => (
              <tr key={job.id}>
                <td className="border p-2 dark:border-gray-600">
                  {job.student_name || `#${job.student_id}`}
                </td>
                <td className="border p-2 dark:border-gray-600">{job.pages || '—'}</td>
                <td className="border p-2 dark:border-gray-600">
                  {job.printType ? JSON.parse(job.printType).join(', ') : '—'}
                </td>
                <td className="border p-2 dark:border-gray-600">
                  <a
                    href={job.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline dark:text-blue-400"
                  >
                    View File
                  </a>
                </td>
                <td className="border p-2 space-x-2 dark:border-gray-600">
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

      {/* ✅ Student Feedback Viewer */}
      <FeedbackViewer vendorId={vendorId} />
    </div>
  );
};

export default VendorDashboard;
