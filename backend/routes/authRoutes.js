const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/student/signup', authController.studentSignup);
router.post('/student/login', authController.studentLogin);
router.post('/vendor/signup', authController.vendorSignup);
router.post('/vendor/login', authController.vendorLogin);

module.exports = router;
