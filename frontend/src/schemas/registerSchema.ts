// src/schemas/registerSchema.ts
import * as Yup from 'yup';

export const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['manager', 'employee'], 'Invalid role').required('Role is required'),
});
