import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AssignTaskModal from '../components/AssignTaskModal';
import socket from '../utils/socket';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    assignedTo: { name: string };
}

const ManagerDashboard: React.FC = () => {
    const { token, user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const fetchAssignedTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks/manager', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching tasks', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleUpdate = async (values: any) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/tasks/${selectedTask?._id}`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(prev => prev.map(task => task._id === res.data._id ? res.data : task));
            alert('Task updated successfully')
            setShowModal(false);
            setSelectedTask(null);
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(prev => prev.filter(task => task._id !== id));
            alert('Deleted successfully')
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    useEffect(() => {
        fetchAssignedTasks();

        socket.on('newTask', (newTask: Task) => {
            console.log('📡 New task received via socket:', newTask);
            setTasks((prev) => [...prev, newTask]);
        });

        socket.on('taskUpdated', (updatedTask: Task) => {
            console.log('📡 Task updated via socket:', updatedTask);
            setTasks((prev) =>
                prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
            );
        });

        socket.on('taskDeleted', (deletedId: string) => {
            console.log('📡 Task deleted via socket:', deletedId);
            setTasks((prev) => prev.filter((task) => task._id !== deletedId));
        });

        return () => {
            socket.off('newTask');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
    }, []);


    return (
        <div className="container-fluid mt-3">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 bg-light border-end vh-100 p-3">
                    <h4>🔧 Manager Panel</h4>
                    <hr />
                    <div className="mb-3">
                        <strong>👤 Name:</strong> <br />
                        {user?.name}
                    </div>
                    {/* <div className="mb-3">
                        <strong>📧 Email:</strong> <br />
                        {user?.email}
                    </div> */}
                    <div>
                        <strong>🧾 Role:</strong> <br />
                        <span className="badge bg-info text-dark">{user?.role}</span>
                    </div>
                    <hr />
                    <p className="text-muted">Use the dashboard to manage tasks.</p>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    <h2>📋 Manager Dashboard</h2>
                    <div className="d-flex justify-content-between align-items-center my-3">
                        <h5>Assigned Tasks</h5>
                        <button onClick={() => { setSelectedTask(null); setShowModal(true) }} className="btn btn-primary btn-sm">
                            ➕ Assign New Task
                        </button>
                    </div>

                    {/* {showModal && (
                        <AssignTaskModal
                            onClose={() => setShowModal(false)}
                            onSuccess={fetchAssignedTasks}
                            task={selectedTask}
                            onUpdate={handleUpdate}
                        />
                    )} */}


                    {showModal && selectedTask ? (
                        // Edit mode
                        <AssignTaskModal
                            initialValues={{
                                title: selectedTask.title,
                                description: selectedTask.description,
                                status: selectedTask.status,
                                assignedTo: '', // Optional: prefill if needed
                            }}
                            onClose={() => {
                                setSelectedTask(null);
                                setShowModal(false);
                            }}
                            onSubmit={handleUpdate}
                        />
                    ) : showModal ? (
                        // Create mode
                        <AssignTaskModal
                            onClose={() => setShowModal(false)}
                            onSuccess={fetchAssignedTasks}
                        />
                    ) : null}




                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p>No tasks assigned yet.</p>
                    ) : (
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task._id}>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.status}</td>
                                        <td>{task.assignedTo?.name || 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(task)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(task._id)}
                                            >
                                                🗑 Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
