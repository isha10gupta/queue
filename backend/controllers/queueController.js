const pool = require('../config/db');

// Submit Print Job
const submitPrintJob = async (req, res) => {
  const {
    studentId,
    vendorId,
    fileName,
    estimatedTime,
    pages,
    shop,
    printType,
    status,
  } = req.body;

  if (
    studentId == null ||
    vendorId == null ||
    fileName == null ||
    estimatedTime == null ||
    pages == null
  ) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const [insertResult] = await pool.query(
      `INSERT INTO print_jobs 
       (student_id, vendor_id, file_name, estimated_time, status, pages, shop, printType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        vendorId,
        fileName,
        estimatedTime,
        status || 'pending',
        pages,
        shop || '',
        printType || '',
      ]
    );

    res.json({ success: true, message: 'Print job submitted successfully' });
  } catch (err) {
    console.error('❌ Submit job error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit job' });
  }
};

// Mark job as completed
const markPrintJobDone = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Get job info (pages, vendor_id)
    const [jobRows] = await pool.query(
      'SELECT vendor_id, pages FROM print_jobs WHERE id = ? AND status != "completed"',
      [jobId]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({ message: 'Job not found or already completed' });
    }

    const { vendor_id, pages } = jobRows[0];
    const amount = pages * 2;

    // 1. Mark the job completed
    await pool.query(
      'UPDATE print_jobs SET status = "completed" WHERE id = ?',
      [jobId]
    );

    // 2. Add amount to vendor_earnings
    await pool.query(
      `INSERT INTO vendor_earnings (vendor_id, total_earnings)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE total_earnings = total_earnings + ?`,
      [vendor_id, amount, amount]
    );

    res.json({ success: true, message: `Job marked done. ₹${amount} added to earnings.` });
  } catch (err) {
    console.error('❌ Error marking job done:', err);
    res.status(500).json({ message: 'Failed to mark job as done' });
  }
};


// Get Today's Earnings (₹2 per page)
const getTodayEarnings = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const [result] = await pool.query(
      `SELECT SUM(pages) AS total_pages 
       FROM print_jobs 
       WHERE vendor_id = ? AND DATE(created_at) = CURDATE() AND status = 'completed'`,
      [vendorId]
    );

    const earnings = result[0].total_pages ? result[0].total_pages * 2 : 0;
    res.json({ earnings });
  } catch (err) {
    console.error('❌ Earnings error:', err);
    res.status(500).json({ message: 'Failed to calculate earnings' });
  }
};

// Get Today's Job Stats
const getTodayStats = async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const [result] = await pool.query(
      `SELECT COUNT(*) AS jobs, SUM(pages) AS pages
       FROM print_jobs
       WHERE vendor_id = ? AND DATE(created_at) = CURDATE() AND status = 'completed'`,
      [vendorId]
    );
    res.json({
      jobs: result[0].jobs || 0,
      pages: result[0].pages || 0,
    });
  } catch (err) {
    console.error('❌ Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to get stats' });
  }
};

// Get Estimated Time
const getEstimatedTime = async (req, res) => {
  const { shop } = req.query;

  const shopToVendor = {
    gate10: 1,
    shop2: 2,
    shop3: 3,
    shop4: 4,
    shop5: 5,
  };

  const vendorId = shopToVendor[shop?.toLowerCase()];
  if (!vendorId) {
    return res.status(400).json({ message: 'Invalid shop' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS jobCount FROM print_jobs WHERE vendor_id = ? AND status = "pending"',
      [vendorId]
    );

    const jobCount = rows[0].jobCount || 0;

    if (jobCount >= 8) {
      return res.status(200).json({
        allowed: false,
        estimatedTime: null,
        message: 'Vendor queue full. Please select another shop.',
      });
    }

    const estimatedTime = jobCount * 2;

    return res.status(200).json({
      allowed: true,
      estimatedTime,
      message: `Estimated time is ${estimatedTime} minutes.`,
    });

  } catch (err) {
    console.error('❌ Error in estimating time:', err);
    return res.status(500).json({
      allowed: false,
      message: 'Internal server error',
    });
  }
};

// Get Jobs by Student
const getStudentPrintJobs = async (req, res) => {
  const { studentId } = req.params;
  try {
    const [jobs] = await pool.query(
      'SELECT * FROM print_jobs WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );
    res.json({ success: true, jobs });
  } catch (err) {
    console.error('❌ Student jobs error:', err);
    res.status(500).json({ success: false, message: 'Failed to get print jobs' });
  }
};

// Get Jobs by Vendor
const getVendorPrintJobs = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const [jobs] = await pool.query(
      `SELECT pj.*, s.name AS student_name 
       FROM print_jobs pj
       LEFT JOIN students s ON pj.student_id = s.id
       WHERE pj.vendor_id = ? AND pj.status = 'pending'
       ORDER BY pj.created_at DESC`,
      [vendorId]
    );
    res.json({ success: true, jobs });
  } catch (err) {
    console.error('❌ Vendor jobs error:', err);
    res.status(500).json({ success: false, message: 'Failed to get print jobs' });
  }
};

// Update Job
const updatePrintJobStatus = async (req, res) => {
  const { jobId } = req.params;
  const { status, estimatedTime } = req.body;
  try {
    await pool.query(
      'UPDATE print_jobs SET status = ?, estimated_time = ? WHERE id = ?',
      [status, estimatedTime || null, jobId]
    );
    res.json({ success: true, message: 'Print job updated' });
  } catch (err) {
    console.error('❌ Update job error:', err);
    res.status(500).json({ success: false, message: 'Failed to update print job' });
  }
};

// Delete Job
const deletePrintJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    await pool.query('DELETE FROM print_jobs WHERE id = ?', [jobId]);
    res.json({ success: true, message: 'Print job deleted' });
  } catch (err) {
    console.error('❌ Delete job error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete print job' });
  }
};

module.exports = {
  submitPrintJob,
  markPrintJobDone,
  getTodayEarnings,
  getEstimatedTime,
  getStudentPrintJobs,
  getVendorPrintJobs,
  updatePrintJobStatus,
  deletePrintJob,
  getTodayStats
};
