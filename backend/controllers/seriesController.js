const Series = require('../models/Series');
const Measurement = require('../models/Measurement');

const getSeries = async (req, res) => {
  try {
    const series = await Series.find({});
    res.json(series);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const createSeries = async (req, res) => {
  try {
    const { name, min_value, max_value, color } = req.body;

    const series = new Series({
      name,
      min_value,
      max_value,
      color,
    });

    const createdSeries = await series.save();
    res.status(201).json(createdSeries);
  } catch (error) {
    res.status(400).send('Invalid data');
  }
};

const updateSeries = async (req, res) => {
  try {
    const { name, min_value, max_value, color } = req.body;
    const series = await Series.findById(req.params.id);

    if (series) {
      series.name = name || series.name;
      series.min_value = min_value ?? series.min_value;
      series.max_value = max_value ?? series.max_value;
      series.color = color || series.color;

      const updatedSeries = await series.save();
      res.json(updatedSeries);
    } else {
      res.status(404).send('Series not found');
    }
  } catch (error) {
    res.status(400).send('Update failed');
  }
};

const deleteSeries = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);

    if (series) {
      await Measurement.deleteMany({ series: req.params.id });
      await series.deleteOne();
      res.send('Series and associated measurements removed');
    } else {
      res.status(404).send('Series not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getSeries, createSeries, updateSeries, deleteSeries };
