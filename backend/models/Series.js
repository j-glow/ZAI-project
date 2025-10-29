const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Series extends Model {}

Series.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New Series',
    trim: true
  },
  min_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  max_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 100
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#8884d8'
  }
}, {
  sequelize,
  modelName: 'Series'
});

module.exports = Series;