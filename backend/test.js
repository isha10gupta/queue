const axios = require('axios');

const testStudentSignup = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/student/signup', {
      usn: "22EC" + Math.floor(Math.random() * 1000),
      name: "Test User",
      email: "test" + Date.now() + "@example.com",
      password: "password123",
      phone: "9999999999"
    });

    console.log("✅ Signup Success:", response.data);
  } catch (err) {
    console.error("❌ Signup Failed:", err.response?.data || err.message);
  }
};

testStudentSignup();
