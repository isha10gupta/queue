import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    driveLink: '',
    pages: '',
    printType: [],
    shop: '',
  });

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
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/queue/estimate?shop=${formData.shop}`
    );

    if (!res.data.allowed) {
      setEstimatedTime(null);
      setVendorFull(true); // ⬅️ Add this
      setMessage(res.data.message);
      return;
    }

    const est = parseInt(res.data.estimatedTime);
    setEstimatedTime(!isNaN(est) ? est : 0); // 0 is allowed
    setVendorFull(false); // ⬅️ Reset this when vendor is not full
    setMessage(`✅ Estimated Time: ${est} minutes`);
  } catch (err) {
    console.error('❌ Estimate error:', err);
    setEstimatedTime(null);
    setVendorFull(false); // Prevent lockout on error
    setMessage('Error estimating time');
  }
};



 const handleSubmit = async (e) => {
  e.preventDefault();

  if (vendorFull) {
    setMessage('🚫 Vendor queue full. Choose another shop.');
    return;
  }

  const pages = parseInt(formData.pages);
  const estimatedTimeInt = parseInt(estimatedTime);

  // ✅ Validate input explicitly
  if (!pages || !formData.driveLink || isNaN(estimatedTimeInt)) {
    setMessage('❌ Please fill all fields correctly.');
    return;
  }

  const vendorId = shopToVendor[formData.shop];
  if (!vendorId) {
    setMessage('❌ Invalid shop selected.');
    return;
  }

  const payload = {
    studentId,
    vendorId,
    fileName: formData.driveLink.trim(),
    estimatedTime: estimatedTimeInt,
    pages: pages,
    shop: formData.shop,
    printType: JSON.stringify(formData.printType),
    status: 'pending',
  };

  console.log('Submitting payload:', payload); // ✅ Debug line

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/queue/submit`, payload);
    setMessage(res.data.message || '✅ Print job submitted successfully');
    fetchStudentJobs();
  } catch (err) {
    console.error('❌ Submit error:', err?.response?.data || err.message);
    setMessage(err?.response?.data?.message || '❌ Failed to submit print request');
  }
};



  const fetchStudentJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/queue/printjob/student/${studentId}`
      );
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStudentJobs();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-md bg-white rounded">
      <h2 className="text-2xl font-bold mb-4">👋 Hey, {studentName}</h2>
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
          <option value="gate10">gate10</option>
          <option value="shop2">Shop 2</option>
          <option value="shop3">Shop 3</option>
          <option value="shop4">Shop 4</option>
          <option value="shop5">Shop 5</option>
        </select>

        <div className="mb-3">
          <label className="mr-2">Print Type:</label>
          {['Black & White', 'Color', 'Side by Side'].map((type) => (
            <label key={type} className="mr-2">
              <input
                type="checkbox"
                value={type}
                onChange={handleCheckboxChange}
              />{' '}
              {type}
            </label>
          ))}
        </div>

        <button
          type="button"
          className="bg-yellow-600 text-white px-4 py-2 rounded mr-3"
          onClick={handleEstimate}
        >
          Estimate Time
        </button>

        {estimatedTime !== null && (
          <div className="text-blue-600 mb-3">
            Estimated Time: {estimatedTime} min
          </div>
        )}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit Print Request
        </button>

        {message && (
          <div className={message.startsWith('❌') || message.startsWith('🚫') ? 'text-red-600 mt-3' : 'text-green-600 mt-3'}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">📋 My Print Jobs</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs submitted yet</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-3">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">File</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="border border-gray-300 p-2">{job.file_name}</td>
                  <td className="border border-gray-300 p-2">
                    {job.status === 'completed' ? '✅ Done' : '⏳ Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
