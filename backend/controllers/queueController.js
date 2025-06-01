const pool = require('../config/db');

// Add print job
exports.addPrintJob = async (req, res) => {
  const { studentId, fileName, pages, status, vendorId, estimatedTime } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO print_jobs (student_id, file_name, pages, status, vendor_id, estimated_time) VALUES (?, ?, ?, ?, ?, ?)`,
      [studentId, fileName, pages, status || 'queued', vendorId, estimatedTime || null]
    );
    res.json({ success: true, jobId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add print job' });
  }
};

// Get print jobs by student
exports.getStudentPrintJobs = async (req, res) => {
  const { studentId } = req.params;
  try {
    const [jobs] = await pool.query(
      'SELECT * FROM print_jobs WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );
    res.json({ success: true, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to get print jobs' });
  }
};

// Get print jobs by vendor
exports.getVendorPrintJobs = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const [jobs] = await pool.query(
      'SELECT * FROM print_jobs WHERE vendor_id = ? ORDER BY created_at DESC',
      [vendorId]
    );
    res.json({ success: true, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to get print jobs' });
  }
};

// Update print job status (e.g., mark done)
exports.updatePrintJobStatus = async (req, res) => {
  const { jobId } = req.params;
  const { status, estimatedTime } = req.body;
  try {
    await pool.query(
      'UPDATE print_jobs SET status = ?, estimated_time = ? WHERE id = ?',
      [status, estimatedTime || null, jobId]
    );
    res.json({ success: true, message: 'Print job updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update print job' });
  }
};

// Delete print job
exports.deletePrintJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    await pool.query('DELETE FROM print_jobs WHERE id = ?', [jobId]);
    res.json({ success: true, message: 'Print job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete print job' });
  }
};
