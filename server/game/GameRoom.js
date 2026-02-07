const GameState = require('./GameState');
const { TICK_RATE } = require('./config');

class GameRoom {
  constructor(roomCode, io) {
    this.roomCode = roomCode;
    this.io = io;
    this.players = []; // Array of socket IDs
    this.playerIds = new Map(); // Map socket ID to player index (0 or 1)
    this.dogSelections = new Map(); // Map player index to dog name (dog1-dog5)
    this.gameState = null;
    this.gameLoop = null;
    this.status = 'waiting'; // 'waiting', 'selecting', 'playing', 'finished'
  }

  addPlayer(socket) {
    if (this.players.length >= 2) {
      return { success: false, message: 'Room is full' };
    }

    const playerId = this.players.length;
    this.players.push(socket.id);
    this.playerIds.set(socket.id, playerId);
    socket.join(this.roomCode);

    console.log(`Player ${playerId} (${socket.id}) joined room ${this.roomCode}`);

    // If we have 2 players, show dog selection
    if (this.players.length === 2) {
      this.status = 'selecting';
      this.io.to(this.roomCode).emit('dog-selection-ready');
      console.log(`Both players connected in room ${this.roomCode} - showing dog selection`);
    } else {
      // Notify player they're waiting
      socket.emit('waiting-for-player');
    }

    return { success: true, playerId };
  }

  handleDogSelection(socket, dogName) {
    const playerId = this.playerIds.get(socket.id);
    if (playerId === undefined) return;

    console.log(`Player ${playerId} selected ${dogName} in room ${this.roomCode}`);
    this.dogSelections.set(playerId, dogName);

    // If both players have selected, start the game
    if (this.dogSelections.size === 2) {
      console.log(`Both players selected dogs in room ${this.roomCode} - starting game`);
      this.startGame();
    }
  }

  startGame() {
    console.log(`Starting game in room ${this.roomCode}`);
    this.status = 'playing';

    // Pass dog selections to game state
    const dogSelections = {
      0: this.dogSelections.get(0) || 'dog1',
      1: this.dogSelections.get(1) || 'dog2'
    };

    this.gameState = new GameState(dogSelections);

    // Notify all players that the game is starting
    this.io.to(this.roomCode).emit('game-start', this.gameState.toJSON());

    // Start the game loop
    this.gameLoop = setInterval(() => {
      this.update();
    }, TICK_RATE);
  }

  update() {
    if (!this.gameState) return;

    this.gameState.update();

    // Broadcast game state to all players in the room
    this.io.to(this.roomCode).emit('game-state', this.gameState.toJSON());

    // Check if game is over
    if (this.gameState.isGameOver()) {
      this.endGame();
    }
  }

  endGame() {
    console.log(`Game ended in room ${this.roomCode}`);
    this.status = 'finished';

    // Stop the game loop
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }

    // Send game over event
    this.io.to(this.roomCode).emit('game-over', {
      winner: this.gameState.winner,
      finalScores: this.gameState.scores
    });
  }

  handlePlayerInput(socket, direction) {
    if (this.status !== 'playing' || !this.gameState) return;

    const playerId = this.playerIds.get(socket.id);
    if (playerId !== undefined) {
      this.gameState.handlePlayerInput(playerId, direction);
    }
  }

  handlePlayerDisconnect(socket) {
    const playerId = this.playerIds.get(socket.id);
    if (playerId === undefined) return;

    console.log(`Player ${playerId} disconnected from room ${this.roomCode}`);

    // Remove player
    const index = this.players.indexOf(socket.id);
    if (index > -1) {
      this.players.splice(index, 1);
    }
    this.playerIds.delete(socket.id);

    // If game is in progress, end it (other player wins)
    if (this.status === 'playing') {
      // Stop the game loop
      if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
      }

      // Notify other player
      this.io.to(this.roomCode).emit('player-disconnected', { playerId });
    }

    return this.players.length === 0; // Return true if room is now empty
  }

  getPlayerCount() {
    return this.players.length;
  }

  isFull() {
    return this.players.length >= 2;
  }
}

module.exports = GameRoom;
