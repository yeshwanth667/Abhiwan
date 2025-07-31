// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Welcome to Dashboard</h2>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>User ID:</strong> {user.userId}</p>
          </>
        ) : (
          <p className="text-danger">User not found. Please login again.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
