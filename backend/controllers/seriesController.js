const Series = require('../models/Series');
const Measurement = require('../models/Measurement');

const getSeries = async (req, res) => {
  try {
    const series = await Series.findAll({});
    res.json(series);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const createSeries = async (req, res) => {
  try {
    const { name, min_value, max_value, color } = req.body;

    if (typeof min_value !== 'number' || typeof max_value !== 'number' || !isFinite(min_value) || !isFinite(max_value)) {
      return res.status(400).send('min_value and max_value must be numbers');
    }

    if (min_value >= max_value) {
      return res.status(400).send('Min value must be less than max value');
    }

    const seriesExists = await Series.findOne({ where: { name } });

    if (seriesExists) {
      return res.status(400).send('Series with this name already exists');
    }

    const series = await Series.create({
      name,
      min_value,
      max_value,
      color,
    });

    res.status(201).json(series);
  } catch (error) {
    res.status(400).send('Invalid data');
  }
};

const updateSeries = async (req, res) => {
  try {
    const { name, min_value, max_value, color } = req.body;
    const series = await Series.findByPk(req.params.id);

    if (series) {
      const new_min_value = min_value ?? series.min_value;
      const new_max_value = max_value ?? series.max_value;

      if (typeof new_min_value !== 'number' || typeof new_max_value !== 'number' || !isFinite(new_min_value) || !isFinite(new_max_value)) {
        return res.status(400).send('min_value and max_value must be numbers');
      }

      if (new_min_value >= new_max_value) {
        return res.status(400).send('Min value must be less than max value');
      }

      series.name = name || series.name;
      series.min_value = new_min_value;
      series.max_value = new_max_value;
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
    const series = await Series.findByPk(req.params.id);

    if (series) {
      await Measurement.destroy({ where: { seriesId: req.params.id } });
      await series.destroy();
      res.send('Series and associated measurements removed');
    } else {
      res.status(404).send('Series not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = { getSeries, createSeries, updateSeries, deleteSeries };