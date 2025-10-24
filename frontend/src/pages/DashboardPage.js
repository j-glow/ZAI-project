import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import MeasurementChart from '../components/MeasurementChart';
import MeasurementTable from '../components/MeasurementTable';
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
  const [selectedSeries, setSelectedSeries] = useState({});
  const [activeView, setActiveView] = useState('measurement');
  const [highlightedPoint, setHighlightedPoint] = useState(null);
  const [tableSeriesFilter, setTableSeriesFilter] = useState('all');

  const fetchData = useCallback(async () => {
    try {
      setError('');

      const [seriesRes, measurementsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/series'),
        axios.get('http://localhost:5000/api/measurements')
      ]);

      setSeriesList(seriesRes.data);
      setMeasurements(measurementsRes.data);

      setSelectedSeries(prevSelected => {
        if (Object.keys(prevSelected).length === 0) {
          const initialSelected = {};
          seriesRes.data.forEach((series) => {
            initialSelected[series._id] = true;
          });
          return initialSelected;
        }
        return prevSelected;
      });

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
      if (!m.series || !selectedSeries[m.series._id]) {
        return false;
      }
      if (startDate && new Date(m.timestamp) < new Date(startDate)) { return false; }
      if (endDate && new Date(m.timestamp) > new Date(endDate)) { return false; }
      return true;
    });
  }, [measurements, startDate, endDate, selectedSeries]);

  const visibleSeriesList = useMemo(() => {
    return seriesList.filter((s) => selectedSeries[s._id]);
  }, [seriesList, selectedSeries]);

  const tableFilteredMeasurements = useMemo(() => {
    if (tableSeriesFilter === 'all') {
      return filteredMeasurements;
    }
    return filteredMeasurements.filter(m => m.series?._id === tableSeriesFilter);
  }, [filteredMeasurements, tableSeriesFilter]);


  const handleSeriesToggle = (seriesId) => {
    setSelectedSeries((prev) => ({ ...prev, [seriesId]: !prev[seriesId] }));
  };

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
                    selectedSeries={selectedSeries}
                    handleSeriesToggle={handleSeriesToggle}
                  />
                )}
              </>
            )}
          </div>

          <div className="chart-area">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button onClick={fetchData} className="no-print" style={{fontSize: '0.8rem'}}>
                Refresh
              </button>
            </div>
            <div className="chart-wrapper">
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
          </div>
        </div>
        <div className="table-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            {!loading && (
              <select
                value={tableSeriesFilter}
                onChange={(e) => setTableSeriesFilter(e.target.value)}
                style={{ padding: '5px' }}
                className="no-print"
              >
                <option value="all">Show All Series</option>
                {seriesList.map((series) => (
                  <option key={series._id} value={series._id}>
                    Show only: {series.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="table-scroll-wrapper">
            {loading ? (
              <p>Loading table...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <MeasurementTable
                measurements={tableFilteredMeasurements}
                onMeasurementDeleted={fetchData}
                highlightedPoint={highlightedPoint}
                setHighlightedPoint={setHighlightedPoint}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
