import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FeedbackForm({ studentId, vendorId }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submitFeedback = async () => {
    try {
      await axios.post("http://localhost:5000/api/queue/feedback", {
        student_id: studentId,
        vendor_id: vendorId,
        message,
      });
      setStatus("✅ Feedback submitted!");
      setMessage("");
    } catch {
      setStatus("❌ Failed to submit feedback");
    }
  };

  return (
    <div className="p-4 border mt-6 rounded shadow-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600">
      <h2 className="text-xl font-semibold mb-2">Give Feedback</h2>
      <textarea
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        rows="4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your feedback here..."
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={submitFeedback}
      >
        Submit
      </button>
      <p className="mt-2 text-sm text-green-600">{status}</p>
    </div>
  );
}

const StudentDashboard = () => {
  const [formData, setFormData] = useState({ driveLink: '', pages: '', printType: [], shop: '' });
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [message, setMessage] = useState('');
  const [jobs, setJobs] = useState([]);
  const [vendorFull, setVendorFull] = useState(false);

  const studentId = localStorage.getItem('studentId') || 1;
  const studentName = localStorage.getItem('studentName') || 'Student';

  const shopToVendor = {
    gate10: 1,
    shop2: 2,
    shop3: 3,
    shop4: 4,
    shop5: 5,
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/queue/estimate?shop=${formData.shop}`);
      if (!res.data.allowed) {
        setEstimatedTime(null);
        setVendorFull(true);
        setMessage(res.data.message);
        return;
      }
      const est = parseInt(res.data.estimatedTime);
      setEstimatedTime(!isNaN(est) ? est : 0);
      setVendorFull(false);
      setMessage(`✅ Estimated Time: ${est} minutes`);
    } catch {
      setEstimatedTime(null);
      setVendorFull(false);
      setMessage('Error estimating time');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vendorFull) return setMessage('🚫 Vendor queue full. Choose another shop.');

    const pages = parseInt(formData.pages);
    const estimatedTimeInt = parseInt(estimatedTime);
    if (!pages || !formData.driveLink || isNaN(estimatedTimeInt)) {
      return setMessage('❌ Please fill all fields correctly.');
    }

    const vendorId = shopToVendor[formData.shop];
    if (!vendorId) return setMessage('❌ Invalid shop selected.');

    const payload = {
      studentId,
      vendorId,
      fileName: formData.driveLink.trim(),
      estimatedTime: estimatedTimeInt,
      pages,
      shop: formData.shop,
      printType: JSON.stringify(formData.printType),
      status: 'pending',
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/queue/submit`, payload);
      setMessage(res.data.message || '✅ Print job submitted successfully');
      fetchStudentJobs();
    } catch (err) {
      setMessage(err?.response?.data?.message || '❌ Failed to submit print request');
    }
  };

  const fetchStudentJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/queue/printjob/student/${studentId}`);
      setJobs(res.data.jobs || []);
    } catch {}
  };

  useEffect(() => {
    fetchStudentJobs();
    const interval = setInterval(fetchStudentJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-md bg-white dark:bg-gray-900 dark:text-white rounded">
      <h2 className="text-2xl font-bold mb-4">👋 Hey, {studentName}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="driveLink"
          placeholder="Google Drive Link"
          className="block w-full mb-3 p-2 border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pages"
          placeholder="Number of Pages"
          className="block w-full mb-3 p-2 border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleChange}
          required
        />
        <select
          name="shop"
          className="block w-full mb-3 p-2 border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleChange}
          required
        >
          <option value="">Select Shop</option>
          <option value="gate10">Gate10</option>
          <option value="shop2">Shop 2</option>
          <option value="shop3">Shop 3</option>
          <option value="shop4">Shop 4</option>
          <option value="shop5">Shop 5</option>
        </select>
        <div className="mb-3">
          <label className="mr-2">Print Type:</label>
          {['Black & White', 'Color', 'Side by Side'].map((type) => (
            <label key={type} className="mr-2">
              <input type="checkbox" value={type} onChange={handleCheckboxChange} /> {type}
            </label>
          ))}
        </div>
        <button
          type="button"
          className="bg-yellow-600 text-white px-4 py-2 rounded mr-3 hover:bg-yellow-700"
          onClick={handleEstimate}
        >
          Estimate Time
        </button>
        {estimatedTime !== null && (
          <div className="text-blue-400 dark:text-blue-300 mb-3">
            Estimated Time: {estimatedTime} min
          </div>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Print Request
        </button>
        {message && (
          <div className={`${message.startsWith('❌') || message.startsWith('🚫') ? 'text-red-500' : 'text-green-500'} mt-3`}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">📋 My Print Jobs</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No jobs submitted yet</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 mt-3">
            <thead>
              <tr>
                <th className="border p-2 dark:border-gray-600">File</th>
                <th className="border p-2 dark:border-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="border p-2 dark:border-gray-600">{job.file_name}</td>
                  <td className="border p-2 dark:border-gray-600">
                    {job.status === 'completed' ? '✅ Done' : '⏳ Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <FeedbackForm studentId={studentId} vendorId={shopToVendor[formData.shop] || 1} />
    </div>
  );
};

export default StudentDashboard;
