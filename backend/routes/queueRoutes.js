const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Student print jobs
// router.post('/printjob', queueController.addPrintJob);
router.get('/printjob/student/:studentId', queueController.getStudentPrintJobs);

// Vendor print jobs
router.get('/printjob/vendor/:vendorId', queueController.getVendorPrintJobs);
router.put('/printjob/:jobId', queueController.updatePrintJobStatus);
router.delete('/printjob/:jobId', queueController.deletePrintJob);

// Mark job as done
router.put('/printjob/:jobId/done', queueController.markPrintJobDone);
router.post('/submit', queueController.submitPrintJob);
router.get('/earnings/:vendorId/today', queueController.getTodayEarnings);
router.get('/estimate', queueController.getEstimatedTime);

module.exports = router;
