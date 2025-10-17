const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const measurementRoutes = require('./routes/measurementRoutes');

dotenv.config();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
