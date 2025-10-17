const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'New Series'
  },
  min_value: {
    type: Number,
    required: true,
    default: 0
  },
  max_value: {
    type: Number,
    required: true,
    default: 100
  },
  color: {
    type: String,
    default: '#8884d8'
  }
});

const Series = mongoose.model('Series', seriesSchema);
module.exports = Series;
