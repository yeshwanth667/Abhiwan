import express from 'express';
import { createTask, getMyTasks, updateTaskStatus, updateTask, deleteTask,getTasksAssignedByManager } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/rbac.middleware';

const router = express.Router();

router.post('/', authenticate, authorizeRole(['manager']), createTask);
router.get('/my', authenticate, authorizeRole(['employee']), getMyTasks);
router.patch('/:id/status', authenticate, authorizeRole(['employee']), updateTaskStatus);
router.patch('/:id', authenticate, authorizeRole(['manager']), updateTask);
router.delete('/:id', authenticate, authorizeRole(['manager']), deleteTask);
router.get('/manager', authenticate, authorizeRole(['manager']), getTasksAssignedByManager);

export default router;