// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/dashboard">📋 Collab To-Do</Link>
      <div className="ms-auto">
        {user ? (
          <button className="btn btn-light" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link className="btn btn-light me-2" to="/login">Login</Link>
            <Link className="btn btn-outline-light" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default App;
