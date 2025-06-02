import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const StudentChoose = () => {
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);

  return (
    <div className={`flex items-center justify-center min-h-[80vh] ${dark ? "bg-gray-900" : "bg-gray-100"} px-4`}>
      <div className={`${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-md shadow-md text-center w-full max-w-sm`}>
        <h2 className="text-xl font-semibold mb-4">Are you logging in or signing up?</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/student/login')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate('/student/signup')}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
          >
            Student Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChoose;
