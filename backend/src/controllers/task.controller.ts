import { Request, Response } from 'express';
import Task from '../models/task.model';
import { getIO } from '../utils/socketInstance';

export const createTask = async (req: Request, res: Response) => {
  const { title, description, assignedTo } = req.body;
  const createdBy = req.user.userId;
  const io = getIO();

  console.log(`📝 [CreateTask] Title: "${title}" | CreatedBy: ${createdBy} | AssignedTo: ${assignedTo}`);

  try {
    const task = await Task.create({ title, description, assignedTo, createdBy });
    const populatedTask = await task.populate('assignedTo', 'name email');
    io.emit('newTask', populatedTask); // 📡 Emit event

    console.log(`✅ [CreateTask] Task Created: ${task._id}`);
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error(`❌ [CreateTask] Error:`, error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  console.log(`📥 [GetMyTasks] User: ${userId}`);

  try {
    const tasks = await Task.find({ assignedTo: userId });
    console.log(`📋 [GetMyTasks] Total Tasks: ${tasks.length}`);
    res.json(tasks);
  } catch (error) {
    console.error(`❌ [GetMyTasks] Error:`, error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const io = getIO();

  console.log(`🔄 [UpdateStatus] Task ID: ${id} | New Status: ${status}`);

  try {
    // const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true }).populate('assignedTo', 'name email');
    if (!task) {
      console.warn(`⚠️ [UpdateStatus] Task not found: ${id}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    io.emit('taskUpdated', task); // 📡 Emit update
    console.log(`✅ [UpdateStatus] Updated Task: ${task._id}`);
    res.json(task);
  } catch (error) {
    console.error(`❌ [UpdateStatus] Error:`, error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const io = getIO();

  console.log(`🛠 [UpdateTask] Task ID: ${id} | Updates:`, updates);

  try {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true }).populate('assignedTo', 'name email');
    if (!task) {
      console.warn(`⚠️ [UpdateTask] Task not found: ${id}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    io.emit('taskUpdated', task); // 📡 Emit update
    console.log(`✅ [UpdateTask] Updated Task: ${task._id}`);
    res.json(task);
  } catch (error) {
    console.error(`❌ [UpdateTask] Error:`, error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const io = getIO();

  console.log(`🗑 [DeleteTask] Deleting Task ID: ${id}`);

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      console.warn(`⚠️ [DeleteTask] Task not found: ${id}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    io.emit('taskDeleted', id); // 📡 Emit delete
    console.log(`✅ [DeleteTask] Deleted Task: ${id}`);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(`❌ [DeleteTask] Error:`, error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

export const getTasksAssignedByManager = async (req: Request, res: Response) => {
  const managerId = req.user.userId;
  console.log(`📡 [ManagerTasks] Fetching tasks created by: ${managerId}`);

  try {
    const tasks = await Task.find({ createdBy: managerId }).populate('assignedTo', 'name email');
    console.log(`📋 [ManagerTasks] Total Tasks: ${tasks.length}`);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('❌ [ManagerTasks] Error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};
