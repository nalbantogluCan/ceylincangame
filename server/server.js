const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const GameRoom = require('./game/GameRoom');
const { generateRoomCode } = require('./utils/idGenerator');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Store active game rooms
const rooms = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle room creation
  socket.on('create-room', () => {
    let roomCode;
    // Generate unique room code
    do {
      roomCode = generateRoomCode();
    } while (rooms.has(roomCode));

    // Create new game room
    const room = new GameRoom(roomCode, io);
    rooms.set(roomCode, room);

    // Add player to room
    const result = room.addPlayer(socket);
    if (result.success) {
      socket.emit('room-created', { roomCode, playerId: result.playerId });
      console.log(`Room created: ${roomCode}`);
    }
  });

  // Handle room joining
  socket.on('join-room', (data) => {
    const { roomCode } = data;

    if (!roomCode) {
      socket.emit('error', { message: 'Room code is required' });
      return;
    }

    const room = rooms.get(roomCode.toUpperCase());

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.isFull()) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    const result = room.addPlayer(socket);
    if (result.success) {
      socket.emit('room-joined', { playerId: result.playerId });
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  // Handle player input
  socket.on('player-input', (data) => {
    const { direction } = data;

    // Find which room this player is in
    for (const [roomCode, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        room.handlePlayerInput(socket, direction);
        break;
      }
    }
  });

  // Handle dog selection
  socket.on('select-dog', (data) => {
    const { dogName } = data;

    // Find which room this player is in
    for (const [roomCode, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        room.handleDogSelection(socket, dogName);
        break;
      }
    }
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const { message } = data;

    // Find which room this player is in
    for (const [roomCode, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        const playerId = room.playerIds.get(socket.id);
        // Broadcast message to all players in the room
        io.to(roomCode).emit('chat-message', {
          playerId,
          message
        });
        break;
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Find and handle player disconnect in their room
    for (const [roomCode, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        const isEmpty = room.handlePlayerDisconnect(socket);

        // Remove empty rooms
        if (isEmpty) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Access from other devices using your local IP on port ${PORT}`);
});
