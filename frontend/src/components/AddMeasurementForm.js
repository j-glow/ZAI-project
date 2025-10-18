import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const formStyle = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '20px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr auto',
  gap: '10px',
  alignItems: 'flex-end',
};
const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};
const inputStyle = {
  padding: '8px',
  marginTop: '4px',
};
const buttonStyle = {
  padding: '8px 16px',
  height: '40px',
  background: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const AddMeasurementForm = ({ seriesList, onMeasurementAdded }) => {
  const { userInfo } = useAuth();

  const [series, setSeries] = useState(seriesList[0]?._id || '');
  const [value, setValue] = useState('');
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!series) {
      return setError('Please select a series.');
    }
    const selectedSeries = seriesList.find(s => s._id === series);
    const numValue = parseFloat(value);

    if (numValue < selectedSeries.min_value || numValue > selectedSeries.max_value) {
      return setError(
        `Value is outside the allowed range (${selectedSeries.min_value} - ${selectedSeries.max_value})`
      );
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'http://localhost:5000/api/measurements',
        {
          series,
          value: numValue,
          timestamp,
        },
        config
      );

      setSuccess('Measurement added!');
      setValue('');
      onMeasurementAdded();
    } catch (err) {
      setError(err.response?.data || 'Failed to add measurement');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={inputGroupStyle}>
        <label>Series</label>
        <select
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          style={inputStyle}
        >
          {seriesList.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} (Min: {s.min_value}, Max: {s.max_value})
            </option>
          ))}
        </select>
      </div>

      <div style={inputGroupStyle}>
        <label>Value</label>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label>Timestamp</label>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <button type="submit" style={buttonStyle}>Add Measurement</button>

      {error && <p style={{ color: 'red', gridColumn: '1 / -1' }}>{error}</p>}
      {success && <p style={{ color: 'green', gridColumn: '1 / -1' }}>{success}</p>}
    </form>
  );
};

export default AddMeasurementForm;
