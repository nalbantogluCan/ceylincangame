export class InputHandler {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.debounceTime = 100; // milliseconds - prevents too-fast movement
    this.lastInputTime = 0;

    this.keyMap = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT'
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.keyMap.hasOwnProperty(e.key)) {
        e.preventDefault(); // Prevent scrolling

        const direction = this.keyMap[e.key];
        const now = Date.now();

        // Debounce input to avoid too-fast spam
        if (now - this.lastInputTime < this.debounceTime) {
          return;
        }

        // Send input every time a key is pressed (manual movement)
        this.networkManager.sendInput(direction);
        this.lastInputTime = now;
      }
    });
  }

  reset() {
    this.lastInputTime = 0;
  }
}
