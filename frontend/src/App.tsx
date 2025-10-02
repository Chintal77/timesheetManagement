import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeDetails from './pages/EmployeeDetails';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />
      <Route path="/employee/:id" element={<EmployeeDetails />} />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
