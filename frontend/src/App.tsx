import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeDetails from './pages/EmployeeDetails';
import AttendancePage from './pages/AttendancePage';
import TimesheetFill from './pages/TimesheetFill';
import TicketPage from './pages/Ticket';
import AdminTicketPage from './pages/AdminTicketPage';
import Leave from './pages/Leave';
import AttendanceSummary from './pages/employeeAttendance';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'employee' | null>(null);

  // Get logged-in user from localStorage on refresh
  React.useEffect(() => {
    const loggedUser = localStorage.getItem('loggedInUser');
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setIsLoggedIn(true);
      setUserRole(user.email === 'admin@gmail.com' ? 'admin' : 'employee');
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            userRole === 'admin' ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/timesheet" />
            )
          ) : (
            <Login
              onLogin={() => {
                const loggedUser = JSON.parse(
                  localStorage.getItem('loggedInUser') || '{}'
                );
                setUserRole(
                  loggedUser.email === 'admin@gmail.com' ? 'admin' : 'employee'
                );
                setIsLoggedIn(true);
              }}
            />
          )
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn && userRole === 'admin' ? (
            <Dashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Employee pages */}
      <Route
        path="/timesheet"
        element={
          isLoggedIn && userRole === 'employee' ? (
            <TimesheetFill />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Employee Details & Attendance */}
      <Route path="/employee/:id" element={<EmployeeDetails />} />
      <Route path="/attendance/:id" element={<AttendancePage />} />

      <Route path="/tickets" element={<TicketPage />} />
      <Route path="/leaves" element={<Leave />} />
      <Route path="/AdminTicketPage" element={<AdminTicketPage />} />
      <Route path="/summary" element={<AttendanceSummary />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
