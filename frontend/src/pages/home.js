// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <h1 className="text-4xl font-bold mb-6">Welcome to QueueBot</h1>
    <div className="space-x-4">
      <Link to="/student/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Student Login
      </Link>
      <Link to="/vendor/login" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Vendor Login
      </Link>
      <Link to="/student/signup" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Student Signup
      </Link>
    </div>
  </div>
);

export default Home;
