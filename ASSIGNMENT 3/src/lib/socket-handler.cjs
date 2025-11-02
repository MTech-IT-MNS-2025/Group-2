
const { Server } = require('socket.io');

// --- USE RELATIVE PATHS ---
const dbConnect = require('./db.cjs');
const Message = require('../models/Message.cjs');
const User = require('../models/User.cjs');
// ---------------------------

const users = {};

async function getUserId(username) {
  await dbConnect();
  const user = await User.findOne({ username }).select('_id');
  return user?._id;
}

// --- EXPORT USING module.exports ---
const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    path: '/api/socket_io',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('Authentication error: Username not provided.'));
    }
    
    socket.username = username;
    users[username] = socket.id;
    console.log(`User connected: ${username} [${socket.id}]`);
    next();
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      delete users[socket.username];
      console.log(`User disconnected: ${socket.username}`);
    });

    socket.on('send_message', async ({ receiver, text }) => {
      const sender = socket.username;

      try {
        const senderId = await getUserId(sender);
        const receiverId = await getUserId(receiver);

        if (!senderId || !receiverId) {
          console.error('Could not find sender or receiver ID');
          return;
        }

        await Message.create({
          sender: senderId,
          receiver: receiverId,
          text: text,
          timestamp: new Date(),
        });

        const receiverSocketId = users[receiver];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', {
            sender,
            text,
          });
        }
      } catch (err) {
        console.error('Error saving or sending message:', err);
      }
    });
  });

  console.log('Socket.IO server initialized');
  return io;
};

module.exports = { initSocketServer };
// ------------------------------------
