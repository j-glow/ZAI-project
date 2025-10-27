import React from 'react';
import Select from 'react-select';
import ManagerBox from './ManagerBox';

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};
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
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setChartSeriesFilter([]);
  };

  const seriesOptions = seriesList.map((series) => ({
    value: series._id,
    label: series.name,
  }));

  const handleSeriesChange = (selectedOptions) => {
    setChartSeriesFilter(selectedOptions ? selectedOptions.map((option) => option.value) : []);
  };

  const selectedValues = seriesOptions.filter((option) => chartSeriesFilter.includes(option.value));

  return (
    <ManagerBox className={className}>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={dateInputRowStyle}>
            <label>Start:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
              step="1"
            />
          </div>
          <div style={dateInputRowStyle}>
            <label>Stop:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
              step="1"
            />
          </div>
        </div>
        <div style={{ ...inputGroupStyle, width: '250px' }}>
          <label>Series:</label>
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

        <button onClick={handleClear} style={{ padding: '8px 16px', height: '37px' }}>
          Clear
        </button>
      </div>
    </ManagerBox>
  );
};

export default DataFilters;
