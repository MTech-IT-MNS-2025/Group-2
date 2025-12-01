const { Server } = require('socket.io');
const dbConnect = require('./db.cjs');
const Message = require('../models/Message.cjs');
const User = require('../models/User.cjs');

const users = {};

async function getUserId(username) {
  await dbConnect();
  const user = await User.findOne({ username }).select('_id');
  return user?._id;
}

const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    path: '/api/socket_io',
    addTrailingSlash: false,
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ['websocket', 'polling'] 
  });

  io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) return next(new Error('Auth error'));
    socket.username = username;
    users[username] = socket.id;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      if (socket.username) delete users[socket.username];
    });

    socket.on('send_message', async (data) => {
      const sender = socket.username;
      const { receiver, text, kem, iv, senderText, senderKem } = data; 

      // --- SPEED FIX 1: Send to Recipient IMMEDIATELY (Don't wait for DB) ---
      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', data);
      }
      // ----------------------------------------------------------------------

      try {
        const senderId = await getUserId(sender);
        const receiverId = await getUserId(receiver);

        if (senderId && receiverId) {
            await Message.create({
              sender: senderId,
              receiver: receiverId,
              text, kem, senderText, senderKem, iv,
              timestamp: new Date(),
            });
        }
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });
  });
  return io;
};

module.exports = { initSocketServer };