require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');
const Series = require('./models/Series');
const Measurement = require('./models/Measurement');

const seedDatabase = async () => {
  try {
    // Synchronize all models
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create users
    const users = await User.bulkCreate([
      { username: 'admin', password: 'admin' },
      { username: 'sensor1', password: 'sensor1' },
      { username: 'sensor2', password: 'sensor2' },
      { username: 'sensor3', password: 'sensor3' },
    ]);
    console.log('Users created');

    // Create series
    const series = await Series.bulkCreate([
      { name: 'Temperature', min_value: -20, max_value: 50, color: '#ff6384' },
      { name: 'Humidity', min_value: 0, max_value: 100, color: '#36a2eb' },
      { name: 'Pressure', min_value: 900, max_value: 1100, color: '#cc65fe' },
    ]);
    console.log('Series created');

    // Create measurements
    const measurements = [];
    const now = new Date();
    for (let i = 0; i < 100; i++) {
      const seriesIndex = i % series.length;
      const seriesItem = series[seriesIndex];
      const value = Math.random() * (seriesItem.max_value - seriesItem.min_value) + seriesItem.min_value;
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // One measurement per hour for the last 100 hours

      measurements.push({
        value: value,
        timestamp: timestamp,
        seriesId: seriesItem.id,
      });
    }
    await Measurement.bulkCreate(measurements);
    console.log('Measurements created');

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
