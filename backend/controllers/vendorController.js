const pool = require('../config/db');

// Get vendor details by ID
exports.getVendorDetails = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const [vendors] = await pool.query('SELECT id, username, email, shop_name FROM vendors WHERE id = ?', [vendorId]);
    if (vendors.length === 0) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, vendor: vendors[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to get vendor details' });
  }
};
