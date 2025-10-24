import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
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
const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px 8px',
};

const MeasurementTable = ({ measurements, onMeasurementDeleted, setHighlightedPoint, highlightedPoint, onMeasurementUpdated }) => {
  const { userInfo } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ value: '', timestamp: '' });

  const handleEdit = (measurement) => {
    setEditingId(measurement._id);
    setEditFormData({
      value: measurement.value,
      timestamp: new Date(measurement.timestamp).toISOString().slice(0, 19),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/measurements/${id}`, editFormData, config);
      setEditingId(null);
      onMeasurementUpdated();
    } catch (error) {
      console.error('Failed to update measurement', error);
      alert('Failed to update measurement');
    }
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

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
    <table style={tableStyle} onMouseLeave={() => setHighlightedPoint(null)}>
      <thead style={{ background: '#f4f4f4' }}>
        <tr>
          <th style={thStyle}>Value</th>
          <th style={thStyle}>Timestamp</th>
          <th style={thStyle} className="no-print">Actions</th>
        </tr>
      </thead>
      <tbody>
        {measurements.length > 0 ? (
          measurements.map((m) => (
            <tr
              key={m._id}
              onClick={() => editingId !== m._id && setHighlightedPoint(m.timestamp)}
              style={m.timestamp === highlightedPoint ? { background: '#e6f7ff', cursor: 'pointer' } : { cursor: 'pointer' }}
            >
              {editingId === m._id ? (
                <>
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
                  <td style={tdStyle} className="no-print">
                    <button onClick={() => handleUpdate(m._id)}>Save</button>
                    <button onClick={handleCancel} style={{ marginLeft: '5px' }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={tdStyle}>{m.value.toFixed(2)}</td>
                  <td style={tdStyle}>{new Date(m.timestamp).toLocaleString('default', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  })}</td>
                  <td style={tdStyle} className="no-print">
                    <button onClick={() => handleEdit(m)}>Edit</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(m._id); }}
                      style={{ marginLeft: '5px', background: 'red', color: 'white' }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" style={{ ...tdStyle, textAlign: 'center', padding: '20px' }}>
              No measurements found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MeasurementTable;
