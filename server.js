import 'dotenv/config';

import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*' // Allow all origins for now, you can restrict this later
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1] || socket.handshake.query?.token;

    const projectId = socket.handshake.query.projectId;
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error('Invalid project ID'));
    }

    socket.project = await projectModel.findById(projectId);



    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.join(socket.project._id.toString());

  socket.on('event', data => {
    /* … */
  });

  socket.on('project-message', async data => {
    // Broadcast to other users
    socket.broadcast.to(socket.project._id.toString()).emit('project-message', data);

    // Save to database
    try {
      const project = await projectModel.findById(socket.project._id);
      if (project) {
        project.messages.push({
          text: data.text,
          sender: data.sender
        });
        await project.save();
      }
    } catch (error) {
      console.error("Failed to save message to database:", error);
    }
  })

  socket.on('project-update-file-tree', async ({ fileTree }) => {
    socket.broadcast.to(socket.project._id.toString()).emit('project-update-file-tree', { fileTree });
    try {
      await projectModel.findByIdAndUpdate(socket.project._id, { fileTree });
    } catch (error) {
      console.error("Failed to update file tree:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.leave(socket.project._id.toString());
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
