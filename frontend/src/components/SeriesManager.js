import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ManagerBox from './ManagerBox';

const formStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
  gridTemplateRows: 'auto auto',
  gap: '10px 20px',
  alignItems: 'flex-end',
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
  gridColumn: '4 / 5',
  gridRow: '1 / 2',
};

const SeriesManager = ({ onSeriesChange }) => {
  const { userInfo } = useAuth();

  const [name, setName] = useState('New Series');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [color, setColor] = useState('#000000');
  const [createError, setCreateError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (Number(minValue) >= Number(maxValue)) {
      setCreateError('Min value must be less than max value.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `${process.env.REACT_APP_API_URL}/series`,
        { name, min_value: minValue, max_value: maxValue, color },
        config
      );
      onSeriesChange();
      setName('New Series');
      setMinValue(0);
      setMaxValue(100);
    } catch (err) {
      setCreateError(err.response?.data || 'Failed to create series');
    }
  };

  return (
    <ManagerBox>
      <form onSubmit={handleCreate} style={formStyle}>
        <div style={{...inputGroupStyle, gridColumn: '1 / 2'}}>
          <label>Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{...inputStyle, height: '40px'}} required />
        </div>
        <div style={{...inputGroupStyle, gridColumn: '2 / 3'}}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => { if (name === 'New Series') setName(''); }}
            onBlur={() => { if (name === '') setName('New Series'); }}
            style={name === 'New Series' ? {...inputStyle, color: 'grey'} : {...inputStyle, color: 'black'}}
            required
          />
        </div>
        <div style={{...inputGroupStyle, gridColumn: '3 / 4'}}>
          <label>Min Value</label>
          <input
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value === '' ? '' : Number(e.target.value))}
            onFocus={() => { if (minValue === 0) setMinValue(''); }}
            onBlur={() => { if (minValue === '') setMinValue(0); }}
            style={minValue === 0 ? {...inputStyle, color: 'grey'} : {...inputStyle, color: 'black'}}
            required
          />
        </div>
        <div style={{...inputGroupStyle, gridColumn: '4 / 5'}}>
          <label>Max Value</label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value === '' ? '' : Number(e.target.value))}
            onFocus={() => { if (maxValue === 100) setMaxValue(''); }}
            onBlur={() => { if (maxValue === '') setMaxValue(100); }}
            style={maxValue === 100 ? {...inputStyle, color: 'grey'} : {...inputStyle, color: 'black'}}
            required
          />
        </div>
        <button type="submit" style={{...buttonStyle, gridColumn: '5 / 6'}}>Add Series</button>
        <div style={{ gridColumn: '1 / -1', minHeight: '24px' }}>
          {createError && <p style={{ color: 'red', margin: 0 }}>{createError}</p>}
        </div>
      </form>
    </ManagerBox>
  );
};

export default SeriesManager;
