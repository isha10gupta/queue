import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 className="text-3xl font-bold">Welcome to QueueBot</h1>
    <div className="flex gap-4">
      <Link to="/student/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Student Login</Link>
      <Link to="/student/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg">Student Signup</Link>
      <Link to="/vendor/login" className="px-4 py-2 bg-gray-700 text-white rounded-lg">Vendor Login</Link>
    </div>
  </div>
);

export default Home;
