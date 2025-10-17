const express = require('express');
const router = express.Router();
const {
  getSeries,
  createSeries,
  updateSeries,
  deleteSeries,
} = require('../controllers/seriesController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getSeries);

router.route('/').post(protect, createSeries);
router.route('/:id').put(protect, updateSeries);
router.route('/:id').delete(protect, deleteSeries);

module.exports = router;
