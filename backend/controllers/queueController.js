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
    const [result] = await pool.query(
      'UPDATE print_jobs SET status = "completed" WHERE id = ?',
      [jobId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job marked as completed' });
  } catch (err) {
    console.error('❌ Mark done error:', err);
    res.status(500).json({ message: 'Failed to mark job as done' });
  }
};

// Get Today's Earnings
const getTodayEarnings = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const [result] = await pool.query(
      `SELECT SUM(pages) AS total_pages 
       FROM print_jobs 
       WHERE vendor_id = ? AND DATE(created_at) = CURDATE() AND status = 'completed'`,
      [vendorId]
    );

    const earnings = result[0].total_pages ? result[0].total_pages * 1 : 0;
    res.json({ earnings });
  } catch (err) {
    console.error('❌ Earnings error:', err);
    res.status(500).json({ message: 'Failed to calculate earnings' });
  }
};

// Estimate Time and Queue Check
exports.getEstimatedTime = async (req, res) => {
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
// ✅ Estimate Time for Shop
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

    const jobCount = rows[0].jobCount;

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
    console.error('❌ Error calculating estimated time:', err);
    res.status(500).json({ success: false, message: 'Failed to calculate estimated time' });
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
  deletePrintJob
};
