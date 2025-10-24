import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const formStyle = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '20px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr auto',
  gridTemplateRows: 'auto auto',
  gap: '10px 20px',
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
  height: '100%',
  background: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  gridColumn: '4 / 5',
  gridRow: '1 / 3',
};

const AddMeasurementForm = ({ seriesList, onMeasurementAdded }) => {
  const { userInfo } = useAuth();

  const [series, setSeries] = useState(seriesList[0]?._id || '');
  const [value, setValue] = useState('');
  const [useCurrentTime, setUseCurrentTime] = useState(true);
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 19));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (useCurrentTime) {
      setTimestamp(new Date().toISOString().slice(0, 19));
    }
  }, [useCurrentTime]);

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

      const timestampToSend = useCurrentTime ? new Date().toISOString() : timestamp;

      await axios.post(
        'http://localhost:5000/api/measurements',
        {
          series,
          value: numValue,
          timestampToSend,
        },
        config
      );

      setSuccess('Measurement added!');
      setValue('');
      onMeasurementAdded();

      if (useCurrentTime) {
        setTimestamp(new Date().toISOString().slice(0, 19));
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to add measurement');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={{...inputGroupStyle, gridColumn: '1 / 2', gridRow: '1 / 2'}}>
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
      <div style={{...inputGroupStyle, gridColumn: '2 / 3', gridRow: '1 / 2'}}>
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
      <div style={{...inputGroupStyle, gridColumn: '3 / 4', gridRow: '1 / 2'}}>
        <label>Timestamp</label>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          style={{
            ...inputStyle,
            background: useCurrentTime ? '#eee' : '#fff'
          }}
          readOnly={useCurrentTime}
          step="1"
        />
      </div>
      <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3', alignSelf: 'flex-start' }}>
        <input
          type="checkbox"
          id="useCurrentTime"
          checked={useCurrentTime}
          onChange={(e) => setUseCurrentTime(e.target.checked)}
        />
        <label htmlFor="useCurrentTime" style={{ marginLeft: '5px' }}>
          Use Current Time
        </label>
      </div>
      <button type="submit" style={buttonStyle}>Add Measurement</button>
      {error && (
        <p style={{
          color: 'red',
          gridColumn: '2 / 3',
          gridRow: '2 / 3',
          alignSelf: 'flex-start',
          margin: 0,
        }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{
          color: 'green',
          gridColumn: '1 / 3',
          gridRow: '2 / 3',
          alignSelf: 'flex-start',
          margin: 0,
        }}>
          {success}
        </p>
      )}
    </form>
  );
};

export default AddMeasurementForm;
