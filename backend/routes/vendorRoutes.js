const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.get('/:vendorId', vendorController.getVendorDetails);

module.exports = router;
