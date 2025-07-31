import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import { registerTaskSocketHandlers } from './sockets/task.socket';
import { initIO } from './utils/socketInstance';
// import './types/express/index'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
initIO(io);

console.log('📦 Initializing backend server...');
console.log('🌍 Setting up middlewares and routes...');
console.log('⚡ Preparing WebSocket...');

// Connect MongoDB
connectDB().then(() => {
  console.log('✅ MongoDB connected successfully.');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', (req, res, next) => {
  console.log(`📡 API Hit: [${req.method}] /api/auth`);
  next();
}, authRoutes);

app.use('/api/tasks', (req, res, next) => {
  console.log(`📡 API Hit: [${req.method}] /api/tasks`);
  next();
}, taskRoutes);

app.use('/api/users', (req, res, next) => {
  console.log(`📡 API Hit: [${req.method}] /api/users`);
  next();
}, userRoutes);

// WebSocket logic
io.on('connection', (socket) => {
  console.log(`🔌 WebSocket connected: ${socket.id}`);
  registerTaskSocketHandlers(socket, io);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
