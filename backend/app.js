const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const queueRoutes = require('./routes/queueRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
console.log('App.js loaded');

// Use auth, queue, and vendor routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/vendor', vendorRoutes);

app.get('/', (req, res) => {
  res.send('QueueBot backend running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
