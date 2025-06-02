import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const LaunchScreen = () => {
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);

  const handleStudentClick = () => {
    navigate('/student/choose');
  };

  const handleVendorClick = () => {
    navigate('/vendor/login');
  };

  return (
    <div className={`flex items-center justify-center min-h-screen px-6 py-16 ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-10 rounded-lg shadow-md text-center w-full max-w-lg ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h1 className="text-4xl font-bold mb-6">Welcome to QueueBot</h1>
        <div className="space-y-4">
          <button
            onClick={handleStudentClick}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-lg"
          >
            I am a Student
          </button>
          <button
            onClick={handleVendorClick}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-lg"
          >
            I am a Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchScreen;
