import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};
const thStyle = {
  background: '#f4f4f4',
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};
const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const MeasurementTable = ({ measurements, onMeasurementDeleted, setHighlightedPoint, highlightedPoint }) => {
  const { userInfo } = useAuth();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this measurement?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.delete(`http://localhost:5000/api/measurements/${id}`, config);

        onMeasurementDeleted();
      } catch (error) {
        console.error('Failed to delete measurement', error);
        alert('Failed to delete measurement');
      }
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Value</th>
            <th style={thStyle}>Series</th>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Actions</th>
            <th style={thStyle} className="no-print">Actions</th>
          </tr>
        </thead>
        <tbody>
          {measurements.length > 0 ? (
            measurements.map((m) => (
              <tr
                key={m._id}
                onClick={() => setHighlightedPoint(m.timestamp)}
                style={m.timestamp === highlightedPoint ? { background: '#e6f7ff', cursor: 'pointer' } : {cursor: 'pointer'}}
              >
                <td style={tdStyle}>{m.value}</td>
                <td style={tdStyle}>
                  <span style={{ color: m.series.color }}>
                    {m.series.name}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(m.timestamp).toLocaleString()}</td>
                <td style={tdStyle} className="no-print">
                  <button>Edit</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(m._id); }}
                    style={{ marginLeft: '5px', background: 'red', color: 'white' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ ...tdStyle, textAlign: 'center' }}>
                No measurements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementTable;
