// src/types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: 'manager' | 'employee';
      };
    }
  }
}

export {};
