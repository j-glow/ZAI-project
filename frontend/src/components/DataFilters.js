import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ManagerBox from './ManagerBox';

const inputStyle = {
  padding: '5px',
};

const dateInputRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const DataFilters = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  seriesList,
  seriesFilter,
  setSeriesFilter,
  filterChart,
  setFilterChart,
  filterTable,
  setFilterTable,
  className,
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('Stop date cannot be earlier than the start date.');
    } else {
      setError('');
    }
  }, [startDate, endDate]);

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setSeriesFilter([]);
  };

  const seriesOptions = seriesList.map((series) => ({
    value: series.id,
    label: series.name,
  }));

  const handleSeriesChange = (selectedOptions) => {
    setSeriesFilter(selectedOptions ? selectedOptions.map((option) => option.value) : []);
  };

  const selectedValues = seriesOptions.filter((option) => seriesFilter.includes(option.value));

  return (
    <ManagerBox className={className}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={dateInputRowStyle}>
            <label>Start:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={error ? { ...inputStyle, borderColor: 'red' } : inputStyle}
              step="1"
            />
          </div>
          <div style={dateInputRowStyle}>
            <label>Stop:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={error ? { ...inputStyle, borderColor: 'red' } : inputStyle}
              step="1"
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '250px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Series:</label>
            <div style={{ flex: 1 }}>
              <Select
                isMulti
                options={seriesOptions}
                value={selectedValues}
                onChange={handleSeriesChange}
                placeholder="Select series to show..."
                closeMenuOnSelect={false}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
          <label>Apply filters to:</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={filterChart}
              onChange={(e) => setFilterChart(e.target.checked)}
            />
            Chart
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={filterTable}
              onChange={(e) => setFilterTable(e.target.checked)}
            />
            Table
          </label>
        </div>

        <button onClick={handleClear} style={{ padding: '8px 16px', height: '37px' }}>
          Clear
        </button>
      </div>
    </ManagerBox>
  );
};

export default DataFilters;
