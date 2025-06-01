const express = require('express');
const cors = require('cors');
const app = express();

// Allow frontend on port 5174 to access backend
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
}));

// Existing middlewares and routes
app.use(express.json());
// ... your routes like app.use('/api/auth', authRoutes);

module.exports = app;
