const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://172.16.10.115:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});


// Middleware
app.use(cors({
  origin: 'http://172.16.10.115:3000',
  methods: ["GET", "POST"]
}));
app.use(express.json());

// Store waiting users and active rooms (in memory)
let waitingUsers = [];
let activeRooms = new Map();
let userCount = 0; // Simple counter for stats

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  userCount++;
  
  // Send current stats
  io.emit('user-count', userCount);

  // Handle user joining queue
  socket.on('join-queue', (userData) => {
    socket.userData = userData;
    
    if (waitingUsers.length > 0) {
      // Match with waiting user
      const partner = waitingUsers.shift();
      const roomId = `room_${socket.id}_${partner.id}`;
      
      // Join both users to room
      socket.join(roomId);
      partner.join(roomId);
      
      // Store room info
      activeRooms.set(socket.id, { roomId, partnerId: partner.id });
      activeRooms.set(partner.id, { roomId, partnerId: socket.id });
      
      // Notify both users
      socket.emit('match-found', { roomId, partnerId: partner.id });
      partner.emit('match-found', { roomId, partnerId: socket.id });
      
      console.log(`Matched users: ${socket.id} and ${partner.id}`);
      
    } else {
      // Add to waiting queue
      waitingUsers.push(socket);
      socket.emit('waiting');
      console.log(`User ${socket.id} added to waiting queue`);
    }
  });

  // Handle text messages
  socket.on('send-message', (data) => {
    const roomInfo = activeRooms.get(socket.id);
    if (roomInfo) {
      socket.to(roomInfo.roomId).emit('receive-message', {
        message: data.message,
        timestamp: new Date()
      });
    }
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    const roomInfo = activeRooms.get(socket.id);
    if (roomInfo) {
      socket.to(roomInfo.partnerId).emit('offer', data);
    }
  });

  socket.on('answer', (data) => {
    const roomInfo = activeRooms.get(socket.id);
    if (roomInfo) {
      socket.to(roomInfo.partnerId).emit('answer', data);
    }
  });

  socket.on('ice-candidate', (data) => {
    const roomInfo = activeRooms.get(socket.id);
    if (roomInfo) {
      socket.to(roomInfo.partnerId).emit('ice-candidate', data);
    }
  });

  // Handle skip/disconnect
  socket.on('skip', () => {
    console.log(`User ${socket.id} skipped`);
    handleUserLeaving(socket);
    socket.emit('skipped');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    userCount = Math.max(0, userCount - 1);
    io.emit('user-count', userCount);
    handleUserLeaving(socket);
  });
});

function handleUserLeaving(socket) {
  // Remove from waiting queue
  waitingUsers = waitingUsers.filter(user => user.id !== socket.id);
  
  // Handle active room
  const roomInfo = activeRooms.get(socket.id);
  if (roomInfo) {
    // Notify partner
    socket.to(roomInfo.partnerId).emit('partner-left');
    
    // Clean up room
    activeRooms.delete(socket.id);
    activeRooms.delete(roomInfo.partnerId);
    
    console.log(`Cleaned up room for users: ${socket.id} and ${roomInfo.partnerId}`);
  }
}

// Simple API endpoint for health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    users: userCount,
    waiting: waitingUsers.length,
    activeRooms: activeRooms.size / 2
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});