import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import MeasurementChart from '../components/MeasurementChart';
import MeasurementTable from '../components/MeasurementTable';
import AddMeasurementForm from '../components/AddMeasurementForm';
import SeriesManager from '../components/SeriesManager';

const DashboardPage = () => {
  const { userInfo, logout } = useAuth();
  const [seriesList, setSeriesList] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setError('');

      const [seriesRes, measurementsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/series'),
        axios.get('http://localhost:5000/api/measurements')
      ]);

      setSeriesList(seriesRes.data);
      setMeasurements(measurementsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Measurement Dashboard</h2>
        <div>
          <span>Logged in as: <strong>{userInfo.username}</strong></span>
          <button onClick={logout} style={{ marginLeft: '1rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <main style={{ padding: '1rem' }}>
        {loading ? (
          <p>Loading manager...</p>
        ) : (
          <SeriesManager
            seriesList={seriesList}
            onSeriesChange={fetchData}
          />
        )}

        <h3>Add New Measurement</h3>
        {loading ? (
          <p>Loading form...</p>
        ) : (
          <AddMeasurementForm
            seriesList={seriesList}
            onMeasurementAdded={fetchData}
          />
        )}

        <h3>Data Chart</h3>
        {loading ? (
          <p>Loading chart...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <MeasurementChart measurements={measurements} seriesList={seriesList} />
        )}

        <h3>Data Table</h3>
        {loading ? (
          <p>Loading table...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <MeasurementTable measurements={measurements} />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
