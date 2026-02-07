export class NetworkManager {
  constructor() {
    this.socket = io();
    this.playerId = null;
    this.roomCode = null;
    this.callbacks = {
      onRoomCreated: null,
      onRoomJoined: null,
      onWaitingForPlayer: null,
      onDogSelectionReady: null,
      onGameStart: null,
      onGameState: null,
      onGameOver: null,
      onPlayerDisconnected: null,
      onError: null,
      onChatMessage: null
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('room-created', (data) => {
      this.playerId = data.playerId;
      this.roomCode = data.roomCode;
      if (this.callbacks.onRoomCreated) {
        this.callbacks.onRoomCreated(data);
      }
    });

    this.socket.on('room-joined', (data) => {
      this.playerId = data.playerId;
      if (this.callbacks.onRoomJoined) {
        this.callbacks.onRoomJoined(data);
      }
    });

    this.socket.on('waiting-for-player', () => {
      if (this.callbacks.onWaitingForPlayer) {
        this.callbacks.onWaitingForPlayer();
      }
    });

    this.socket.on('dog-selection-ready', () => {
      if (this.callbacks.onDogSelectionReady) {
        this.callbacks.onDogSelectionReady();
      }
    });

    this.socket.on('game-start', (data) => {
      if (this.callbacks.onGameStart) {
        this.callbacks.onGameStart(data);
      }
    });

    this.socket.on('game-state', (data) => {
      if (this.callbacks.onGameState) {
        this.callbacks.onGameState(data);
      }
    });

    this.socket.on('game-over', (data) => {
      if (this.callbacks.onGameOver) {
        this.callbacks.onGameOver(data);
      }
    });

    this.socket.on('player-disconnected', (data) => {
      if (this.callbacks.onPlayerDisconnected) {
        this.callbacks.onPlayerDisconnected(data);
      }
    });

    this.socket.on('error', (data) => {
      if (this.callbacks.onError) {
        this.callbacks.onError(data);
      }
    });

    this.socket.on('chat-message', (data) => {
      if (this.callbacks.onChatMessage) {
        this.callbacks.onChatMessage(data);
      }
    });
  }

  createRoom() {
    this.socket.emit('create-room');
  }

  joinRoom(roomCode) {
    this.roomCode = roomCode;
    this.socket.emit('join-room', { roomCode });
  }

  sendInput(direction) {
    this.socket.emit('player-input', { direction });
  }

  sendChatMessage(message) {
    this.socket.emit('chat-message', { message });
  }

  selectDog(dogName) {
    this.socket.emit('select-dog', { dogName });
  }

  on(event, callback) {
    if (this.callbacks.hasOwnProperty('on' + event.charAt(0).toUpperCase() + event.slice(1))) {
      this.callbacks['on' + event.charAt(0).toUpperCase() + event.slice(1)] = callback;
    }
  }
}
