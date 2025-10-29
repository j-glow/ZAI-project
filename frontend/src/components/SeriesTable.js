import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

const SeriesTable = ({ seriesList, measurements, onSeriesChange, isGuest }) => {
  const { userInfo } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    min_value: '',
    max_value: '',
    color: '',
  });

  const handleEdit = (series) => {
    setEditingId(series._id);
    setEditFormData({
      name: series.name,
      min_value: series.min_value,
      max_value: series.max_value,
      color: series.color,
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
      await axios.put(`${process.env.REACT_APP_API_URL}/series/${id}`, editFormData, config);
      setEditingId(null);
      onSeriesChange();
    } catch (error) {
      console.error('Failed to update series', error);
      alert('Failed to update series');
    }
  };

  const handleDelete = async (id) => {
    const measurementsInSeries = measurements.filter(m => m.series?._id === id);
    let confirmMessage = 'Are you sure you want to delete this series?';
    if (measurementsInSeries.length > 0) {
      confirmMessage = `This series contains ${measurementsInSeries.length} data points. Are you sure you want to delete it?`;
    }

    if (window.confirm(confirmMessage)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${process.env.REACT_APP_API_URL}/series/${id}`, config);
        onSeriesChange();
      } catch (error) {
        console.error('Failed to delete series', error);
        alert('Failed to delete series');
      }
    }
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Min Value</th>
          <th style={thStyle}>Max Value</th>
          <th style={thStyle}>Color</th>
          {!isGuest && <th style={thStyle}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {seriesList.map((series) => (
          <tr key={series._id}>
            {editingId === series._id && !isGuest ? (
              <>
                <td style={tdStyle}><input type="text" name="name" value={editFormData.name} onChange={handleFormChange} style={{ width: '100%' }} /></td>
                <td style={tdStyle}><input type="number" name="min_value" value={editFormData.min_value} onChange={handleFormChange} style={{ width: '100%' }} /></td>
                <td style={tdStyle}><input type="number" name="max_value" value={editFormData.max_value} onChange={handleFormChange} style={{ width: '100%' }} /></td>
                <td style={tdStyle}><input type="color" name="color" value={editFormData.color} onChange={handleFormChange} style={{ width: '100%' }} /></td>
                <td style={tdStyle}>
                  <button onClick={() => handleUpdate(series._id)}>Save</button>
                  <button onClick={handleCancel} style={{ marginLeft: '5px' }}>Cancel</button>
                </td>
              </>
            ) : (
              <>
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
                {!isGuest && (
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(series)}>Edit</button>
                    <button onClick={() => handleDelete(series._id)} style={{ marginLeft: '5px', background: 'red', color: 'white' }}>Delete</button>
                  </td>
                )}
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SeriesTable;
