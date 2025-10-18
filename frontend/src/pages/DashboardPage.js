import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import MeasurementChart from '../components/MeasurementChart';
import MeasurementTable from '../components/MeasurementTable';
import AddMeasurementForm from '../components/AddMeasurementForm';
import SeriesManager from '../components/SeriesManager';
import DataFilters from '../components/DataFilters';

const DashboardPage = () => {
  const { userInfo, logout } = useAuth();
  const [seriesList, setSeriesList] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSeries, setSelectedSeries] = useState({});
  const [highlightedPoint, setHighlightedPoint] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError('');

      const [seriesRes, measurementsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/series'),
        axios.get('http://localhost:5000/api/measurements')
      ]);

      setSeriesList(seriesRes.data);
      setMeasurements(measurementsRes.data);

      const initialSelected = {};
      seriesRes.data.forEach((series) => {
        initialSelected[series._id] = true;
      });
      setSelectedSeries(initialSelected);
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

  const filteredMeasurements = useMemo(() => {
    return measurements.filter((m) => {
      if (!selectedSeries[m.series._id]) {
        return false;
      }

      if (startDate && new Date(m.timestamp) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(m.timestamp) > new Date(endDate)) {
        return false;
      }

      return true;
    });
  }, [measurements, startDate, endDate, selectedSeries]);

  const visibleSeriesList = useMemo(() => {
    return seriesList.filter((s) => selectedSeries[s._id]);
  }, [seriesList, selectedSeries]);

  const handleSeriesToggle = (seriesId) => {
    setSelectedSeries((prevSelected) => ({
      ...prevSelected,
      [seriesId]: !prevSelected[seriesId],
    }));
  };

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between', className: "no-print"}}>
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
            className="no-print"
          />
        )}

        <h3>Add New Measurement</h3>
        {loading ? (
          <p>Loading form...</p>
        ) : (
          <AddMeasurementForm
            seriesList={seriesList}
            onMeasurementAdded={fetchData}
            className="no-print"
          />
        )}

        {!loading && (
          <DataFilters
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            seriesList={seriesList}
            selectedSeries={selectedSeries}
            handleSeriesToggle={handleSeriesToggle}
            className="no-print"
          />
        )}

        <button onClick={() => window.print()} className="no-print" style={{marginBottom: '20px'}}>
          Print Report
        </button>

        <div className="chart-container">
        <h3>Data Chart</h3>
        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <MeasurementChart
            measurements={filteredMeasurements}
            seriesList={visibleSeriesList}
            highlightedPoint={highlightedPoint}
          />
        )}
      </div>

        <div className="table-container">
          <h3>Data Table</h3>
          {loading ? (
            <p>Loading table...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <MeasurementTable
              measurements={filteredMeasurements}
              onMeasurementDeleted={fetchData}
              highlightedPoint={highlightedPoint}
              setHighlightedPoint={setHighlightedPoint}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
