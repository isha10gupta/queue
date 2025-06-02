const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const vendorController = require('../controllers/vendorController');

// ✅ Get print jobs for vendor
router.get('/jobs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        pj.id,
        s.usn AS studentUsn,
        pj.vendor_id,
        pj.file_name AS driveLink,
        pj.estimated_time,
        pj.status,
        v.shop_name AS shop
      FROM print_jobs pj
      LEFT JOIN students s ON pj.student_id = s.id
      LEFT JOIN vendors v ON pj.vendor_id = v.id
      ORDER BY pj.created_at DESC
    `);
    res.json({ jobs: rows });
  } catch (err) {
    console.error('🔥 Vendor jobs fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});
// ✅ Vendor views feedback
router.get('/feedbacks', async (req, res) => {
  const vendorId = req.query.vendor_id;
  if (!vendorId) {
    return res.status(400).json({ message: 'Vendor ID required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT f.id, s.usn AS student_usn, f.message, f.created_at FROM feedbacks f JOIN students s ON f.student_id = s.id WHERE f.vendor_id = ? ORDER BY f.created_at DESC',
      [vendorId]
    );
    res.json({ feedbacks: rows });
  } catch (err) {
    console.error('🔥 Fetch feedbacks error:', err);
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
});

module.exports = router;
