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
  chartSeriesFilter,
  setChartSeriesFilter,
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
    setChartSeriesFilter([]);
  };

  const seriesOptions = seriesList.map((series) => ({
    value: series.id,
    label: series.name,
  }));

  const handleSeriesChange = (selectedOptions) => {
    setChartSeriesFilter(selectedOptions ? selectedOptions.map((option) => option.value) : []);
  };

  const selectedValues = seriesOptions.filter((option) => chartSeriesFilter.includes(option.value));

  return (
    <ManagerBox className={className}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '20px', alignItems: 'center' }}>
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

        <button onClick={handleClear} style={{ padding: '8px 16px', height: '37px' }}>
          Clear
        </button>
      </div>
    </ManagerBox>
  );
};

export default DataFilters;
