import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import MeasurementChart from '../components/MeasurementChart';
import MeasurementTable from '../components/MeasurementTable';
import SeriesTable from '../components/SeriesTable';
import AddMeasurementForm from '../components/AddMeasurementForm';
import SeriesManager from '../components/SeriesManager';
import DataFilters from '../components/DataFilters';

import './DashboardPage.css';

const DashboardPage = () => {
  const { userInfo, logout } = useAuth();

  const [seriesList, setSeriesList] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartSeriesFilter, setChartSeriesFilter] = useState('all');

  const [activeView, setActiveView] = useState('measurement');

  const [highlightedPoint, setHighlightedPoint] = useState(null);

  const [tableSeriesFilter, setTableSeriesFilter] = useState('all');

  const [tableMode, setTableMode] = useState('data');

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

  const chartFilteredMeasurements = useMemo(() => {
    return measurements.filter((m) => {
      if (chartSeriesFilter !== 'all' && m.series?._id !== chartSeriesFilter) {
        return false;
      }
      if (startDate && new Date(m.timestamp) < new Date(startDate)) { return false; }
      if (endDate && new Date(m.timestamp) > new Date(endDate)) { return false; }
      return true;
    });
  }, [measurements, startDate, endDate, chartSeriesFilter]);

  const visibleSeriesList = useMemo(() => {
    if (chartSeriesFilter === 'all') {
      return seriesList;
    }
    return seriesList.filter((s) => s._id === chartSeriesFilter);
  }, [seriesList, chartSeriesFilter]);

  const tableFilteredMeasurements = useMemo(() => {
    if (tableSeriesFilter === 'all') {
      return chartFilteredMeasurements;
    }
    return chartFilteredMeasurements.filter(m => m.series?._id === tableSeriesFilter);
  }, [chartFilteredMeasurements, tableSeriesFilter]);


  return (
    <div className="dashboard-page no-print">
      <nav className="dashboard-nav no-print">
        <div className="dashboard-nav-tabs">
          <button
            className={activeView === 'series' ? 'active' : ''}
            onClick={() => setActiveView('series')}
          >
            Manage Series
          </button>
          <button
            className={activeView === 'measurement' ? 'active' : ''}
            onClick={() => setActiveView('measurement')}
          >
            Add Measurement
          </button>
          <button
            className={activeView === 'filter' ? 'active' : ''}
            onClick={() => setActiveView('filter')}
          >
            Filters
          </button>
        </div>
        <div className="dashboard-nav-user">
          <span>Logged in as: <strong>{userInfo.username}</strong></span>
          <button onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      <main className="dashboard-main">
        <div className="dashboard-left">
          <div className="view-manager no-print">
            {loading ? <p style={{padding: '1rem'}}>Loading controls...</p> : (
              <>
                {activeView === 'series' && (
                  <SeriesManager
                    seriesList={seriesList}
                    onSeriesChange={fetchData}
                  />
                )}
                {activeView === 'measurement' && (
                  <AddMeasurementForm
                    seriesList={seriesList}
                    onMeasurementAdded={fetchData}
                  />
                )}
                {activeView === 'filter' && (
                  <DataFilters
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    seriesList={seriesList}
                    chartSeriesFilter={chartSeriesFilter}
                    setChartSeriesFilter={setChartSeriesFilter}
                  />
                )}
              </>
            )}
          </div>
          <div className="chart-area">
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem', gap: '10px' }} className="no-print">
              <button onClick={() => window.print()} style={{fontSize: '0.8rem'}}>
                Print
              </button>
              <button onClick={fetchData} style={{fontSize: '0.8rem'}}>
                Refresh
              </button>
            </div>
            <div className="chart-wrapper">
              {loading ? (
                <p>Loading chart...</p>
              ) : (
                <MeasurementChart
                  measurements={chartFilteredMeasurements}
                  seriesList={visibleSeriesList}
                  highlightedPoint={highlightedPoint}
                />
              )}
            </div>
          </div>
        </div>
        <div className="table-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            {!loading && (
              <>
                <select
                  value={tableMode}
                  onChange={(e) => setTableMode(e.target.value)}
                  className={`no-print table-mode-select ${tableMode === 'series' ? 'series-mode' : ''}`}
                >
                  <option value="data">Data</option>
                  <option value="series">Series</option>
                </select>
                <select
                  value={tableSeriesFilter}
                  onChange={(e) => setTableSeriesFilter(e.target.value)}
                  style={{ padding: '5px' }}
                  className={`no-print ${tableMode === 'series' ? 'series-mode-disabled' : ''}`}
                  disabled={tableMode === 'series'}
                >
                  <option value="all">Show All Series</option>
                  {seriesList.map((series) => (
                    <option key={series._id} value={series._id}>
                      Show only: {series.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          <div className="table-scroll-wrapper">
            {loading ? (
              <p>Loading table...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <>
                {tableMode === 'data' ? (
                  <MeasurementTable
                    measurements={tableFilteredMeasurements}
                    onMeasurementDeleted={fetchData}
                    onMeasurementUpdated={fetchData}
                    highlightedPoint={highlightedPoint}
                    setHighlightedPoint={setHighlightedPoint}
                  />
                ) : (
                  <SeriesTable seriesList={seriesList} onSeriesChange={fetchData} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
