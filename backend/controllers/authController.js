const pool = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// ✅ Student Signup
exports.studentSignup = async (req, res) => {
  const { usn, name, email, password, phone } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM students WHERE email = ? OR usn = ?',
      [email, usn]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Student already exists' });
    }

    const hashed = await bcrypt.hash(password, saltRounds);
    await pool.query(
      'INSERT INTO students (usn, name, email, password, phone) VALUES (?, ?, ?, ?, ?)',
      [usn, name, email, hashed, phone]
    );

    res.status(201).json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

// ✅ Student Login
exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({
      success: true,
      userId: user.id,
      username: user.name,
      usn: user.usn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// ✅ Vendor Signup
exports.vendorSignup = async (req, res) => {
  const { username, email, password, shopName } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM vendors WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Vendor already exists' });
    }

    const hashed = await bcrypt.hash(password, saltRounds);
    await pool.query(
      'INSERT INTO vendors (username, email, password, shop_name) VALUES (?, ?, ?, ?)',
      [username, email, hashed, shopName]
    );
    res.json({ success: true, message: 'Vendor registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

// ✅ Vendor Login
exports.vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({
      success: true,
      userId: user.id,
      username: user.username,
      shopName: user.shop_name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
