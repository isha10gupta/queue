// 🔥 Global crash logger
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception at startup:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection at startup:', reason);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

console.log('✅ App.js loaded');

// ✅ Route imports with debug
console.log('⏳ Loading authRoutes...');
const authRoutes = require('./routes/authRoutes');
console.log('✅ Loaded authRoutes');

console.log('⏳ Loading queueRoutes...');
const queueRoutes = require('./routes/queueRoutes');
console.log('✅ Loaded queueRoutes');

console.log('⏳ Loading vendorRoutes...');
const vendorRoutes = require('./routes/vendorRoutes');
console.log('✅ Loaded vendorRoutes');

// ✅ Register routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/vendor', vendorRoutes);

// ✅ Root test
app.get('/', (req, res) => {
  res.send('QueueBot backend running');
});

// ✅ Debug: Log all routes
const logRoutes = (prefix, router) => {
  router.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase()).join(', ');
      console.log(`→ [${methods}] ${prefix}${layer.route.path}`);
    }
  });
};

setTimeout(() => {
  console.log('\n📦 Registered Routes:');
  logRoutes('/api/auth', authRoutes);
  logRoutes('/api/queue', queueRoutes);
  logRoutes('/api/vendor', vendorRoutes);
}, 300);

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🛠 Optional keep alive for debugging
setInterval(() => {}, 1000);

module.exports = app;
