import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const managerStyle = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '20px',
  background: '#f9f9f9',
};
const formStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
  gap: '10px',
  alignItems: 'flex-end',
  marginBottom: '20px',
};
const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};
const inputStyle = { padding: '8px', marginTop: '4px' };
const buttonStyle = {
  padding: '8px 16px',
  height: '40px',
  background: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
const listStyle = { listStyle: 'none', padding: 0 };
const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  border: '1px solid #ddd',
  marginBottom: '5px',
  background: 'white',
};

const SeriesManager = ({ seriesList, onSeriesChange }) => {
  const { userInfo } = useAuth();

  const [name, setName] = useState('New Series');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [color, setColor] = useState('#000000');
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'http://localhost:5000/api/series',
        {
          name: name,
          min_value: minValue,
          max_value: maxValue,
          color: color,
        },
        config
      );

      onSeriesChange();
      setName('New Series');
      setMinValue(0);
      setMaxValue(100);
    } catch (err) {
      setError(err.response?.data || 'Failed to create series');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? Deleting a series will also delete all its measurements!')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/series/${id}`, config);
        onSeriesChange(); // Refresh the dashboard
      } catch (err) {
        alert('Failed to delete series');
      }
    }
  };

  return (
    <div style={managerStyle}>
      <h4>Manage Series</h4>
      <form onSubmit={handleCreate} style={formStyle}>
        <div style={inputGroupStyle}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        </div>
        <div style={inputGroupStyle}>
          <label>Min Value</label>
          <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} style={inputStyle} required />
        </div>
        <div style={inputGroupStyle}>
          <label>Max Value</label>
          <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} style={inputStyle} required />
        </div>
        <div style={inputGroupStyle}>
          <label>Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{...inputStyle, height: '40px'}} required />
        </div>
        <button type="submit" style={buttonStyle}>Add Series</button>
        {error && <p style={{ color: 'red', gridColumn: '1 / -1' }}>{error}</p>}
      </form>
      <ul style={listStyle}>
        {seriesList.map((s) => (
          <li key={s._id} style={listItemStyle}>
            <div>
              <strong style={{ color: s.color }}>{s.name}</strong>
              <span style={{ fontSize: '0.9em', marginLeft: '10px' }}>
                (Min: {s.min_value}, Max: {s.max_value})
              </span>
            </div>
            <div>
              <button>Edit</button>
              <button
                onClick={() => handleDelete(s._id)}
                style={{ marginLeft: '5px', background: 'red', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeriesManager;
