const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  series: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Series'
  }
});

const Measurement = mongoose.model('Measurement', measurementSchema);
module.exports = Measurement;
