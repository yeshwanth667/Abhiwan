import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, managerId } = req.body;
  console.log(`📥 [RegisterUser] Email: ${email} | Role: ${role}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, managerId });

    console.log(`✅ [RegisterUser] User Created: ${user._id}`);
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    console.error(`❌ [RegisterUser] Error:`, error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(`🔐 [LoginUser] Attempting login: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.warn(`⚠️ [LoginUser] Invalid credentials for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role,name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    console.log(`✅ [LoginUser] Success | User ID: ${user._id} | Role: ${user.role}`);
    // res.status(200).json({ token });
    res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role } });

  } catch (error) {
    console.error(`❌ [LoginUser] Error:`, error);
    res.status(500).json({ message: 'Login failed' });
  }
};
