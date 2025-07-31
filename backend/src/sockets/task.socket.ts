import { Server, Socket } from 'socket.io';

export const registerTaskSocketHandlers = (socket: Socket, io: Server) => {
  socket.on('join', ({ userId }) => {
    socket.join(userId);
        console.log('🔌 WebSocket joined:', userId);
  });

  socket.on('task:assigned', ({ task, assignedTo }) => {
    io.to(assignedTo).emit('task:assigned', task);
    console.log('📤 Task assigned:', task.title, 'to', assignedTo);
  });

  socket.on('task:updated', ({ task }) => {
    io.to(task.assignedTo).emit('task:updated', task);
    console.log('🔄 Task updated:', task._id);
  });

  socket.on('task:statusChanged', ({ taskId, newStatus, managerId }) => {
    io.to(managerId).emit('task:statusChanged', { taskId, newStatus });
    console.log('📣 Status changed:', taskId, '->', newStatus);
  });
};