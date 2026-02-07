import { NetworkManager } from './network/NetworkManager.js';
import { GameClient } from './game/GameClient.js';
import { InputHandler } from './game/InputHandler.js';
import { UIManager } from './ui/UIManager.js';
import { ChatManager } from './ui/ChatManager.js';

class Game {
  constructor() {
    this.networkManager = new NetworkManager();
    this.uiManager = new UIManager();
    this.chatManager = new ChatManager(this.networkManager);
    this.gameClient = null;
    this.inputHandler = null;

    this.setupNetworkCallbacks();
    this.setupUIEvents();
  }

  setupNetworkCallbacks() {
    this.networkManager.on('roomCreated', (data) => {
      this.uiManager.showRoomCode(data.roomCode);
      this.chatManager.setPlayerId(data.playerId);
      console.log('Room created:', data.roomCode, 'Player ID:', data.playerId);
    });

    this.networkManager.on('roomJoined', (data) => {
      this.chatManager.setPlayerId(data.playerId);
      console.log('Room joined. Player ID:', data.playerId);
    });

    this.networkManager.on('waitingForPlayer', () => {
      console.log('Waiting for another player...');
    });

    this.networkManager.on('dogSelectionReady', () => {
      console.log('Both players connected - showing dog selection');
      this.showDogSelection();
    });

    this.networkManager.on('gameStart', (data) => {
      console.log('Game starting!');
      this.chatManager.addSystemMessage('Game started! Good luck!');
      this.startGame(data);
    });

    this.networkManager.on('gameState', (data) => {
      if (this.gameClient) {
        this.gameClient.updateState(data);
        this.uiManager.updateScores(data.scores);
        this.uiManager.updateTimer(data.timeRemaining);
      }
    });

    this.networkManager.on('gameOver', (data) => {
      console.log('Game over!', data);
      this.endGame(data);
    });

    this.networkManager.on('playerDisconnected', () => {
      console.log('Other player disconnected');
      if (this.gameClient) {
        this.gameClient.stop();
      }
      this.chatManager.addSystemMessage('Other player disconnected');
      this.uiManager.showPlayerDisconnected();
    });

    this.networkManager.on('error', (data) => {
      console.error('Error:', data.message);
      this.uiManager.showError(data.message);
    });

    this.networkManager.on('chatMessage', (data) => {
      this.chatManager.addMessage(data.playerId, data.message);
    });
  }

  setupUIEvents() {
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const roomCodeInput = document.getElementById('room-code-input');
    const backToLobbyBtn = document.getElementById('back-to-lobby-btn');

    createRoomBtn.addEventListener('click', () => {
      this.networkManager.createRoom();
    });

    joinRoomBtn.addEventListener('click', () => {
      const roomCode = roomCodeInput.value.trim().toUpperCase();
      if (roomCode.length === 6) {
        this.networkManager.joinRoom(roomCode);
      } else {
        this.uiManager.showError('Please enter a valid 6-character room code');
      }
    });

    roomCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        joinRoomBtn.click();
      }
    });

    roomCodeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });

    backToLobbyBtn.addEventListener('click', () => {
      this.backToLobby();
    });
  }

  startGame(initialState) {
    this.uiManager.showScreen('game');

    const canvas = document.getElementById('game-canvas');
    this.gameClient = new GameClient(canvas);
    this.inputHandler = new InputHandler(this.networkManager);

    this.gameClient.start(initialState);
  }

  endGame(data) {
    if (this.gameClient) {
      this.gameClient.stop();
    }

    this.uiManager.showGameOver(
      data.winner,
      data.finalScores,
      this.networkManager.playerId
    );
  }

  showDogSelection() {
    this.uiManager.showScreen('dog-selection');

    const dogOptions = document.querySelectorAll('.dog-option');
    const selectedMessage = document.querySelector('.dog-selected-message');
    let selectedDog = null;

    dogOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        dogOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selected class to clicked option
        option.classList.add('selected');

        // Get the dog name from data attribute
        const dogName = option.getAttribute('data-dog');
        selectedDog = dogName;

        // Send selection to server
        this.networkManager.selectDog(dogName);

        // Show waiting message
        if (selectedMessage) {
          selectedMessage.style.display = 'block';
          selectedMessage.textContent = `You selected ${dogName.toUpperCase()}! Waiting for other player...`;
        }

        console.log('Dog selected:', dogName);
      });
    });
  }

  backToLobby() {
    if (this.gameClient) {
      this.gameClient.reset();
    }

    if (this.inputHandler) {
      this.inputHandler.reset();
    }

    this.chatManager.clear();
    this.uiManager.reset();
    this.uiManager.showScreen('lobby');

    // Note: In a full implementation, you might want to disconnect and
    // create a new socket connection here
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  console.log('Dog Walking Game initialized!');
});
