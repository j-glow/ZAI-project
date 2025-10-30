import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};
const thStyle = {
  background: '#f4f4f4',
  border: '1px solid #ddd',
  padding: '12px 8px',
  textAlign: 'left',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const valueThStyle = { ...thStyle, width: '20%' };
const seriesThStyle = { ...thStyle, width: '25%' };
const timestampThStyle = { ...thStyle, width: '35%' };
const actionsThStyle = { ...thStyle, width: '20%' };
const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px 8px',
};

const MeasurementTable = ({ measurements, seriesList, onMeasurementDeleted, setHighlightedPoint, highlightedPoint, onMeasurementUpdated, isGuest, seriesFilter }) => {
  const { userInfo } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ value: '', timestamp: '', seriesId: '' });

  const handleEdit = (measurement) => {
    setEditingId(measurement.id);
    setEditFormData({
      value: measurement.value,
      timestamp: new Date(measurement.timestamp).toISOString().slice(0, 19),
      seriesId: String(measurement.series.id),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleUpdate = async () => {
    const currentSeries = seriesList.find(s => s.id === Number(editFormData.seriesId));
    if (currentSeries) {
      const value = parseFloat(editFormData.value);
      if (value < currentSeries.min_value || value > currentSeries.max_value) {
        alert(`Value must be between ${currentSeries.min_value} and ${currentSeries.max_value} for the selected series.`);
        return;
      }
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/measurements/${editingId}`, editFormData, config);
      setEditingId(null);
      onMeasurementUpdated();
    } catch (error) {
      console.error('Failed to update measurement', error);
      const errorMessage = error.response ? error.response.data : 'Failed to update measurement';
      alert(errorMessage);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this measurement?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${process.env.REACT_APP_API_URL}/measurements/${id}`, config);
        onMeasurementDeleted();
      } catch (error) {
        console.error('Failed to delete measurement', error);
        alert('Failed to delete measurement');
      }
    }
  };

  const handleRowClick = (timestamp) => {
    if (highlightedPoint === timestamp) {
      setHighlightedPoint(null);
    } else {
      setHighlightedPoint(timestamp);
    }
  };

  return (
    <table style={tableStyle}>
      <thead style={{ background: '#f4f4f4' }}>
        <tr>
          <th style={seriesThStyle}>Series</th>
          <th style={valueThStyle}>Value</th>
          <th style={timestampThStyle}>Timestamp</th>
          {!isGuest && <th style={actionsThStyle} className="actions-cell">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {measurements.length > 0 ? (
          measurements.map((m) => (
            <tr
              key={m.id}
              onClick={() => handleRowClick(m.timestamp)}
              style={m.timestamp === highlightedPoint ? { background: '#e6f7ff', cursor: 'pointer' } : { cursor: 'pointer' }}
            >
              {editingId === m.id && !isGuest ? (
                <>
                  <td style={tdStyle}>
                    <select
                      name="seriesId"
                      value={editFormData.seriesId}
                      onChange={handleFormChange}
                      style={{ width: '100%' }}
                    >
                      {seriesList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      name="value"
                      value={editFormData.value}
                      onChange={handleFormChange}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="datetime-local"
                      name="timestamp"
                      value={editFormData.timestamp}
                      onChange={handleFormChange}
                      style={{ width: '100%' }}
                      step="any"
                    />
                  </td>
                  <td style={tdStyle}>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={handleCancel} style={{ marginLeft: '5px' }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={tdStyle}>{m.series?.name || 'N/A'}</td>
                  <td style={tdStyle}>{m.value.toFixed(2)}</td>
                  <td style={tdStyle}>{new Date(m.timestamp).toLocaleString('default', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                    hourCycle: 'h23',
                  })}</td>
                  {!isGuest && (
                    <td style={tdStyle} className="actions-cell">
                      <button onClick={() => handleEdit(m)}>Edit</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                        style={{ marginLeft: '5px', background: 'red', color: 'white' }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={!isGuest ? 4 : 3} style={{ ...tdStyle, textAlign: 'center', padding: '20px' }}>
              No measurements found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default React.memo(MeasurementTable);
