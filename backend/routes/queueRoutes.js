const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const pool = require('../config/db');

// 🧾 Student print jobs
router.get('/printjob/student/:studentId', queueController.getStudentPrintJobs);

// 🏪 Vendor print jobs
router.get('/printjob/vendor/:vendorId', queueController.getVendorPrintJobs);
router.put('/printjob/:jobId', queueController.updatePrintJobStatus);
router.delete('/printjob/:jobId', queueController.deletePrintJob);
router.put('/printjob/:jobId/done', queueController.markPrintJobDone);

// 📝 Submit a new print job
router.post('/submit', queueController.submitPrintJob);

// 💰 Today's Earnings (₹2 per page)
router.get('/earnings/:vendorId/today', queueController.getTodayEarnings);

// 💰 Total Earnings (₹2 per page)
router.get('/earnings/:vendorId/total', async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const [result] = await pool.query(
      `SELECT total_earnings FROM vendor_earnings WHERE vendor_id = ?`,
      [vendorId]
    );
    res.json({ earnings: result[0]?.total_earnings || 0 });
  } catch (err) {
    console.error('🔥 Total earnings fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch total earnings' });
  }
});


// 📊 Daily Stats (Jobs and Pages)
router.get('/stats/:vendorId/today', queueController.getTodayStats);

// ⏳ Estimated time
router.get('/estimate', queueController.getEstimatedTime);

// 🗣️ Student submits feedback
router.post('/feedback', async (req, res) => {
  const { student_id, vendor_id, message } = req.body;
  if (!student_id || !vendor_id || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    await pool.query(
      'INSERT INTO feedbacks (student_id, vendor_id, message) VALUES (?, ?, ?)',
      [student_id, vendor_id, message]
    );
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('🔥 Feedback submission error:', err);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

module.exports = router;
