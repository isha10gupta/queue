import React from 'react';
import axios from 'axios';
import SignupForm from '../components/SignupForm';

const StudentSignup = () => {
  const handleSignup = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/student/signup', formData);
      console.log('Signup Success:', response.data);
      alert('Signup successful');
      // Optionally redirect to login or dashboard
    } catch (error) {
      console.error('Signup Failed:', error.response?.data || error.message);
      alert('Signup failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-center text-xl font-semibold mb-4">Student Signup</h2>
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default StudentSignup;
