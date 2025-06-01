// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import VendorLogin from './pages/VendorLogin.jsx';
import StudentSignup from './pages/StudentSignup.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import VendorDashboard from './components/VendorDashboard.jsx';
import Feedback from './components/Feedback.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
};

export default App;
