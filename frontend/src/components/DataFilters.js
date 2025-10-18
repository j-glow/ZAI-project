import React from 'react';

const filterContainerStyle = {
  padding: '15px 20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '20px',
  background: '#f9f9f9',
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start',
};
const timeFilterStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};
const seriesFilterStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};
const checkboxGroupStyle = {
  display: 'block',
  marginRight: '15px',
};

const DataFilters = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  seriesList,
  selectedSeries,
  handleSeriesToggle,
}) => {
  return (
    <div style={filterContainerStyle}>
      <div style={timeFilterStyle}>
        <h4>Filter by Time</h4>
        <div>
          <label style={{ marginRight: '5px' }}>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ marginRight: '5px' }}>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div style={seriesFilterStyle}>
        <h4>Filter by Series</h4>
        <div>
          {seriesList.map((series) => (
            <label key={series._id} style={checkboxGroupStyle}>
              <input
                type="checkbox"
                checked={selectedSeries[series._id] || false}
                onChange={() => handleSeriesToggle(series._id)}
              />
              <span style={{ color: series.color, marginLeft: '5px' }}>
                {series.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataFilters;
