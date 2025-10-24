import React from 'react';
import ManagerBox from './ManagerBox';

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};
const inputStyle = {
  padding: '5px',
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
  return (
    <ManagerBox className={className}>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={inputGroupStyle}>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label>Series:</label>
          <select
            value={chartSeriesFilter}
            onChange={(e) => setChartSeriesFilter(e.target.value)}
            style={{ ...inputStyle, width: '250px' }}
          >
            <option value="all">Show All Series</option>
            {seriesList.map((series) => (
              <option key={series._id} value={series._id}>
                Show only: {series.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ManagerBox>
  );
};

export default DataFilters;
