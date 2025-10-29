const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const measurementRoutes = require('./routes/measurementRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- Simple Test Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/measurements', measurementRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
    process.exit(1);
  }
};

startServer();