const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Series = require('./Series');

class Measurement extends Model {}

Measurement.init({
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Measurement'
});

Measurement.belongsTo(Series, { foreignKey: 'seriesId', as: 'series' });
Series.hasMany(Measurement, { foreignKey: 'seriesId' });

module.exports = Measurement;