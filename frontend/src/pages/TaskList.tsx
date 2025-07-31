// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import socket from '../utils/socket';

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   status: string;
// }

// const TaskList: React.FC = () => {
//   const { token } = useAuth();
//   const [tasks, setTasks] = useState<Task[]>([]);

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/tasks/my', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTasks(res.data);
//     } catch (error) {
//       console.error('Error fetching employee tasks', error);
//     }
//   };

//   const updateStatus = async (taskId: string, newStatus: string) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchTasks();
//     } catch (err) {
//       console.error('Error updating status', err);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();

//     socket.on('newTask', (newTask: Task) => {
//       console.log('📡 [Socket] New Task Received:', newTask);
//       setTasks((prev) => [...prev, newTask]);
//     });

//     return () => {
//       socket.off('newTask');
//     };

//   }, []);

//   return (
//     <div>
//       <h4>📋 My Assigned Tasks</h4>
//       <hr />
//       {tasks.length === 0 ? (
//         <p>No tasks assigned.</p>
//       ) : (
//         <table className="table table-bordered">
//           <thead className="table-light">
//             <tr>
//               <th>Title</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Update</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map(task => (
//               <tr key={task._id}>
//                 <td>{task.title}</td>
//                 <td>{task.description}</td>
//                 <td>{task.status}</td>
//                 <td>
//                   <select
//                     className="form-select"
//                     value={task.status}
//                     onChange={(e) => updateStatus(task._id, e.target.value)}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="in_progress">In Progress</option>
//                     <option value="completed">Completed</option>
//                   </select>
//                 </td>
//                 <td><button className='btn btn-warning'>Edit</button></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TaskList;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import socket from '../utils/socket';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const TaskList: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editedStatus, setEditedStatus] = useState<Record<string, string>>({});
  const [dirtyStatus, setDirtyStatus] = useState<Record<string, boolean>>({});

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching employee tasks', error);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setEditedStatus((prev) => ({ ...prev, [taskId]: newStatus }));
    setDirtyStatus((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleEditClick = async (taskId: string) => {
    const newStatus = editedStatus[taskId];
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Task status updated successfully ${taskId}`)
      await fetchTasks();
      setDirtyStatus((prev) => ({ ...prev, [taskId]: false }));
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on('newTask', (newTask: Task) => {
      console.log('📡 [Socket] New Task Received:', newTask);
      setTasks((prev) => [...prev, newTask]);
    });

    return () => {
      socket.off('newTask');
    };
  }, []);

  return (
    <div>
      <h4>📋 My Assigned Tasks</h4>
      <hr />
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Update</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const currentStatus = editedStatus[task._id] ?? task.status;
              return (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>
                    <select
                      className="form-select"
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      disabled={!dirtyStatus[task._id]}
                      onClick={() => handleEditClick(task._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;

