const express = require('express');
const cors = require('cors');
const app = express();

// 🔄 Import route modules
const authRoutes = require('./routes/authRoutes');
const queueRoutes = require('./routes/queueRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

// 🔐 CORS: Allow frontend (Vite) to access backend
app.use(cors({
  origin: 'http://localhost:5173', // 👈 use 5173 if that's your frontend port
  credentials: true,
}));

// 🧠 Middlewares
app.use(express.json());

// 🚏 Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/vendor', vendorRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('QueueBot backend is up and running');
});

// 🚀 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ App.js loaded`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
