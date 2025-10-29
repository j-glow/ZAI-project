const { Op } = require('sequelize');
const Measurement = require('../models/Measurement');
const Series = require('../models/Series');

const getMeasurements = async (req, res) => {
  try {
    const { seriesId, startDate, endDate } = req.query;

    let filter = {};

    if (seriesId) {
      filter.seriesId = seriesId;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp[Op.lte] = new Date(endDate);
      }
    }

    const measurements = await Measurement.findAll({
      where: filter,
      include: [{ model: Series, as: 'series', attributes: ['name', 'color'] }],
      order: [['timestamp', 'DESC']],
    });

    res.json(measurements);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const createMeasurement = async (req, res) => {
  try {
    const { value, seriesId, timestamp } = req.body;

    const parentSeries = await Series.findByPk(seriesId);
    if (!parentSeries) {
      return res.status(404).send('Series not found');
    }

    if (value < parentSeries.min_value || value > parentSeries.max_value) {
      return res.status(400).send(
        `Value ${value} is outside the allowed range (${parentSeries.min_value} - ${parentSeries.max_value}) for this series.`
      );
    }

    const measurement = await Measurement.create({
      value,
      seriesId,
      timestamp: timestamp || Date.now(),
    });

    res.status(201).json(measurement);
  } catch (error) {
    res.status(400).send('Invalid data');
  }
};

const updateMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id);
    if (!measurement) {
      return res.status(404).send('Measurement not found');
    }

    const { value, seriesId, timestamp } = req.body;

    const newValue = value ?? measurement.value;
    const newSeriesId = seriesId || measurement.seriesId;

    const parentSeries = await Series.findByPk(newSeriesId);
    if (!parentSeries) {
      return res.status(404).send('Series not found');
    }

    if (newValue < parentSeries.min_value || newValue > parentSeries.max_value) {
      return res.status(400).send(
        `Value ${newValue} is outside the allowed range (${parentSeries.min_value} - ${parentSeries.max_value}) for this series.`
      );
    }

    measurement.value = newValue;
    measurement.seriesId = newSeriesId;
    measurement.timestamp = timestamp || measurement.timestamp;

    const updatedMeasurement = await measurement.save();
    res.json(updatedMeasurement);
  } catch (error) {
    res.status(400).send('Update failed');
  }
};

const deleteMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id);

    if (measurement) {
      await measurement.destroy();
      res.send('Measurement removed');
    } else {
      res.status(404).send('Measurement not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getMeasurements, createMeasurement, updateMeasurement, deleteMeasurement };