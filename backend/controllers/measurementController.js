const Measurement = require('../models/Measurement');
const Series = require('../models/Series');

const getMeasurements = async (req, res) => {
  try {
    const { seriesId, startDate, endDate } = req.query;

    let filter = {};

    if (seriesId) {
      filter.series = seriesId;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    const measurements = await Measurement.find(filter)
      .populate('series', 'name color')
      .sort({ timestamp: 'desc' });

    res.json(measurements);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const createMeasurement = async (req, res) => {
  try {
    const { value, series, timestamp } = req.body;

    const parentSeries = await Series.findById(series);
    if (!parentSeries) {
      return res.status(404).send('Series not found');
    }

    if (value < parentSeries.min_value || value > parentSeries.max_value) {
      return res.status(400).send(
        `Value ${value} is outside the allowed range (${parentSeries.min_value} - ${parentSeries.max_value}) for this series.`
      );
    }

    const measurement = new Measurement({
      value,
      series,
      timestamp: timestamp || Date.now(),
    });

    const createdMeasurement = await measurement.save();
    res.status(201).json(createdMeasurement);
  } catch (error) {
    res.status(400).send('Invalid data');
  }
};

const updateMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).send('Measurement not found');
    }

    const { value, series, timestamp } = req.body;

    const newValue = value ?? measurement.value;
    const newSeriesId = series || measurement.series;

    const parentSeries = await Series.findById(newSeriesId);
    if (!parentSeries) {
      return res.status(404).send('Series not found');
    }

    if (newValue < parentSeries.min_value || newValue > parentSeries.max_value) {
      return res.status(400).send(
        `Value ${newValue} is outside the allowed range (${parentSeries.min_value} - ${parentSeries.max_value}) for this series.`
      );
    }

    measurement.value = newValue;
    measurement.series = newSeriesId;
    measurement.timestamp = timestamp || measurement.timestamp;

    const updatedMeasurement = await measurement.save();
    res.json(updatedMeasurement);
  } catch (error) {
    res.status(400).send('Update failed');
  }
};

const deleteMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);

    if (measurement) {
      await measurement.deleteOne();
      res.send('Measurement removed');
    } else {
      res.status(404).send('Measurement not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getMeasurements, createMeasurement, updateMeasurement, deleteMeasurement };
