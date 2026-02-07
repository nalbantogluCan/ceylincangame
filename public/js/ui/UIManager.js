export class UIManager {
  constructor() {
    this.screens = {
      lobby: document.getElementById('lobby-screen'),
      'dog-selection': document.getElementById('dog-selection-screen'),
      game: document.getElementById('game-screen'),
      end: document.getElementById('end-screen')
    };

    this.elements = {
      roomCodeDisplay: document.getElementById('room-code-display'),
      roomCodeText: document.getElementById('room-code-text'),
      errorMessage: document.getElementById('error-message'),
      scorePlayer1: document.getElementById('score-player-1'),
      scorePlayer2: document.getElementById('score-player-2'),
      timer: document.getElementById('timer'),
      resultTitle: document.getElementById('result-title'),
      resultMessage: document.getElementById('result-message'),
      finalScore1: document.getElementById('final-score-1'),
      finalScore2: document.getElementById('final-score-2')
    };
  }

  showScreen(screenName) {
    Object.values(this.screens).forEach(screen => {
      screen.style.display = 'none';
    });

    if (this.screens[screenName]) {
      this.screens[screenName].style.display = 'flex';
    }
  }

  showRoomCode(roomCode) {
    this.elements.roomCodeText.textContent = roomCode;
    this.elements.roomCodeDisplay.style.display = 'block';
  }

  hideRoomCode() {
    this.elements.roomCodeDisplay.style.display = 'none';
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.style.display = 'block';

    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError() {
    this.elements.errorMessage.style.display = 'none';
  }

  updateScores(scores) {
    if (scores && scores.length >= 2) {
      this.elements.scorePlayer1.textContent = scores[0];
      this.elements.scorePlayer2.textContent = scores[1];
    }
  }

  updateTimer(timeRemaining) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    this.elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  showGameOver(winner, finalScores, playerId) {
    this.showScreen('end');

    this.elements.finalScore1.textContent = finalScores[0];
    this.elements.finalScore2.textContent = finalScores[1];

    if (winner === null) {
      this.elements.resultTitle.textContent = "It's a Tie!";
      this.elements.resultMessage.textContent = "You both scored the same!";
    } else if (winner === playerId) {
      this.elements.resultTitle.textContent = "You Won!";
      this.elements.resultMessage.textContent = "Congratulations! You collected more points!";
    } else {
      this.elements.resultTitle.textContent = "You Lost!";
      this.elements.resultMessage.textContent = "Better luck next time!";
    }
  }

  showPlayerDisconnected() {
    this.showScreen('end');
    this.elements.resultTitle.textContent = "Player Disconnected";
    this.elements.resultMessage.textContent = "The other player has left the game.";
  }

  reset() {
    this.hideRoomCode();
    this.hideError();
    this.elements.scorePlayer1.textContent = '0';
    this.elements.scorePlayer2.textContent = '0';
    this.elements.timer.textContent = '2:00';
  }
}
