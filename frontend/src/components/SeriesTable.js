import React from 'react';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const tdStyle = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const SeriesTable = ({ seriesList }) => {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Min Value</th>
          <th style={thStyle}>Max Value</th>
          <th style={thStyle}>Color</th>
        </tr>
      </thead>
      <tbody>
        {seriesList.map((series) => (
          <tr key={series._id}>
            <td style={tdStyle}>{series.name}</td>
            <td style={tdStyle}>{series.min_value}</td>
            <td style={tdStyle}>{series.max_value}</td>
            <td style={tdStyle}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: series.color,
                  border: '1px solid #ccc',
                }}
              ></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SeriesTable;
