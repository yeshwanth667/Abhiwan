import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeInfo: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h4>👤 Employee Information</h4>
      <hr />
      <p><strong>Name:</strong> {user?.name}</p>
      {/* <p><strong>Email:</strong> {user?.email}</p> */}
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  );
};

export default EmployeeInfo;
