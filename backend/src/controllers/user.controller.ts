import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role, managerId } = req.body;
  console.log(`👤 [CreateUser] Creating user: ${email} | Role: ${role}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, managerId });

    console.log(`✅ [CreateUser] User Created: ${user._id}`);
    res.status(201).json(user);
  } catch (error) {
    console.error(`❌ [CreateUser] Error creating user:`, error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  console.log('📋 [GetAllEmployees] Fetching employees...');

  try {
    const employees = await User.find({ role: 'employee' });
    console.log(`✅ [GetAllEmployees] Employees Found: ${employees.length}`);
    res.json(employees);
  } catch (error) {
    console.error(`❌ [GetAllEmployees] Error fetching employees:`, error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};
