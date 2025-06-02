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
import LaunchScreen from './pages/LaunchScreen.jsx';
import Layout from './components/Layout.jsx';
import StudentChoose from './pages/StudentChoose.jsx';

import { ThemeProvider } from './context/ThemeContext.jsx'; // ✅ MOVE HERE

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/launch" element={<Layout><LaunchScreen /></Layout>} />
          <Route path="/student/login" element={<Layout><StudentLogin /></Layout>} />
          <Route path="/vendor/login" element={<Layout><VendorLogin /></Layout>} />
          <Route path="/student/signup" element={<Layout><StudentSignup /></Layout>} />
          <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
          <Route path="/vendor/dashboard" element={<Layout><VendorDashboard /></Layout>} />
          <Route path="/feedback" element={<Layout><Feedback /></Layout>} />
          <Route path="/student/choose" element={<Layout><StudentChoose /></Layout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
