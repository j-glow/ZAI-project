import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

import './App.css';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();
  if (!userInfo) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
