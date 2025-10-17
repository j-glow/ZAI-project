import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { userInfo, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Measurement Dashboard</h2>
        <div>
          <span>Logged in as: <strong>{userInfo.username}</strong></span>
          <button onClick={logout} style={{ marginLeft: '1rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <main style={{ padding: '1rem' }}>
        <h1>Welcome!</h1>
        <p>This is where the charts and tables will go.</p>
      </main>
    </div>
  );
};

export default DashboardPage;
