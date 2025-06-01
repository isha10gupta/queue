// hashPassword.js
const bcrypt = require('bcrypt');

const passwordToHash = 'gate10'; // 🔐 replace this with your vendor password
const saltRounds = 10;

bcrypt.hash(passwordToHash, saltRounds)
  .then(hash => {
    console.log('\n✅ Copy this hashed password:\n');
    console.log(hash);
  })
  .catch(err => {
    console.error('❌ Error hashing password:', err);
  });
