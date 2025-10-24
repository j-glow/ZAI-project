import React from 'react';

const boxStyle = {
  padding: '20px',
  background: '#f9f9f9',
  border: '1px solid #ccc',
  borderRadius: '8px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const ManagerBox = ({ children, className }) => {
  return (
    <div style={boxStyle} className={className}>
      {children}
    </div>
  );
};

export default ManagerBox;
