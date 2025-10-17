const express = require('express');
const router = express.Router();
const {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} = require('../controllers/measurementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getMeasurements);

router.route('/').post(protect, createMeasurement);
router.route('/:id').put(protect, updateMeasurement);
router.route('/:id').delete(protect, deleteMeasurement);

module.exports = router;
