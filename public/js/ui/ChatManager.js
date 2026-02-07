export class ChatManager {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.messagesContainer = document.getElementById('chat-messages');
    this.inputField = document.getElementById('chat-input');
    this.sendButton = document.getElementById('chat-send-btn');
    this.playerId = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Send button click
    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });

    // Enter key to send
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  sendMessage() {
    const message = this.inputField.value.trim();
    if (message.length === 0) return;

    // Send message through network manager
    this.networkManager.sendChatMessage(message);

    // Clear input field
    this.inputField.value = '';
  }

  addMessage(playerId, message, isSystem = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    if (isSystem) {
      messageDiv.classList.add('system-message');
      messageDiv.textContent = message;
    } else {
      const playerLabel = playerId === this.playerId ? 'You' : `Player ${playerId + 1}`;
      const playerClass = playerId === 0 ? 'player-1-msg' : 'player-2-msg';

      messageDiv.classList.add(playerClass);
      messageDiv.innerHTML = `<strong>${playerLabel}:</strong> ${this.escapeHtml(message)}`;
    }

    this.messagesContainer.appendChild(messageDiv);

    // Auto-scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  addSystemMessage(message) {
    this.addMessage(null, message, true);
  }

  setPlayerId(playerId) {
    this.playerId = playerId;
  }

  clear() {
    this.messagesContainer.innerHTML = '';
    this.inputField.value = '';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
