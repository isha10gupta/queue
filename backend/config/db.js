const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'database', // ✅ Update this if your real password is different
  database: 'queuebot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Add this for debugging
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL successfully!');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); // stop app if DB is broken
  }
})();

module.exports = pool;
