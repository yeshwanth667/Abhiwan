import React, { useState } from 'react';
import EmployeeInfo from './EmployeeInfo';
import TaskList from './TaskList';

const EmployeeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'dashboard'>('dashboard');

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              👤 Employee Info
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📋 My Tasks
            </button>
          </div>
        </div>

        <div className="col-9">
          {activeTab === 'info' && <EmployeeInfo />}
          {activeTab === 'dashboard' && <TaskList />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
