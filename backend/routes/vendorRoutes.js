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

module.exports = router;
