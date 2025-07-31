import express from 'express';
import { createUser, getAllEmployees } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/rbac.middleware';

const router = express.Router();

router.post('/', authenticate, authorizeRole(['manager']), createUser);
router.get('/', authenticate, authorizeRole(['manager']), getAllEmployees);

export default router;