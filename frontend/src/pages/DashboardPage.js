import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import MeasurementChart from '../components/MeasurementChart';
import MeasurementTable from '../components/MeasurementTable';
import SeriesTable from '../components/SeriesTable';
import AddMeasurementForm from '../components/AddMeasurementForm';
import SeriesManager from '../components/SeriesManager';
import DataFilters from '../components/DataFilters';
import ChangePassword from '../components/ChangePassword';

import './DashboardPage.css';
import '../components/ChangePassword.css';

const DashboardPage = () => {
  const { userInfo, logout } = useAuth();

  const [seriesList, setSeriesList] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartSeriesFilter, setChartSeriesFilter] = useState([]);

  const [activeView, setActiveView] = useState(userInfo.isGuest ? 'filter' : 'measurement');

  const [highlightedPoint, setHighlightedPoint] = useState(null);

  const [tableSeriesFilter, setTableSeriesFilter] = useState('all');

  const [tableMode, setTableMode] = useState('data');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError('');

      const [seriesRes, measurementsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/series`),
        axios.get(`${process.env.REACT_APP_API_URL}/measurements`)
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
      if (chartSeriesFilter.length > 0 && !chartSeriesFilter.includes(m.series?.id)) {
        return false;
      }
      if (startDate && new Date(m.timestamp) < new Date(startDate)) { return false; }
      if (endDate && new Date(m.timestamp) > new Date(endDate)) { return false; }
      return true;
    });
  }, [measurements, startDate, endDate, chartSeriesFilter]);

  const visibleSeriesList = useMemo(() => {
    if (chartSeriesFilter.length === 0) {
      return seriesList;
    }
    return seriesList.filter((s) => chartSeriesFilter.includes(s.id));
  }, [seriesList, chartSeriesFilter]);

  const tableFilteredMeasurements = useMemo(() => {
    if (tableSeriesFilter === 'all') {
      return measurements;
    }
    return measurements.filter(m => m.series?.id === tableSeriesFilter);
  }, [measurements, tableSeriesFilter]);


  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-tabs">
          {!userInfo.isGuest && (
            <>
              <button
                className={activeView === 'series' ? 'active' : ''}
                onClick={() => setActiveView('series')}
              >
                Series
              </button>
              <button
                className={activeView === 'measurement' ? 'active' : ''}
                onClick={() => setActiveView('measurement')}
              >
                Measurement
              </button>
            </>
          )}
          <button
            className={activeView === 'filter' ? 'active' : ''}
            onClick={() => setActiveView('filter')}
          >
            Filter
          </button>
        </div>
        <div className="dashboard-nav-user">
          <span>Logged in as: <strong>{userInfo.username}</strong></span>
          {!userInfo.isGuest && (
            <button onClick={() => setShowChangePassword(true)}>
              Change Password
            </button>
          )}
          <button onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      {showChangePassword && <ChangePassword setShowChangePassword={setShowChangePassword} />}
      <main className="dashboard-main">
        <div className="dashboard-left">
          <div className="view-manager">
            {loading ? <p style={{padding: '1rem'}}>Loading controls...</p> : (
              <>
                {activeView === 'series' && !userInfo.isGuest && (
                  <SeriesManager
                    seriesList={seriesList}
                    onSeriesChange={fetchData}
                  />
                )}
                {activeView === 'measurement' && !userInfo.isGuest && (
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
            <div className="chart-buttons" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem', gap: '10px' }}>
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
                  className={`table-mode-select ${tableMode === 'series' ? 'series-mode' : ''}`}
                >
                  <option value="data">Data</option>
                  <option value="series">Series</option>
                </select>
                <select
                  value={tableSeriesFilter}
                  onChange={(e) => setTableSeriesFilter(e.target.value)}
                  style={{ padding: '5px' }}
                  className={`${tableMode === 'series' ? 'series-mode-disabled' : ''}`}
                  disabled={tableMode === 'series'}
                >
                  <option value="all">Show All Series</option>
                  {seriesList.map((series) => (
                    <option key={series.id} value={series.id}>
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
                    isGuest={userInfo.isGuest}
                    tableSeriesFilter={tableSeriesFilter}
                  />
                ) : (
                  <SeriesTable
                    seriesList={seriesList}
                    measurements={measurements}
                    onSeriesChange={fetchData}
                    isGuest={userInfo.isGuest}
                  />
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
