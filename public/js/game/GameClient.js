import { Renderer } from './Renderer.js';

export class GameClient {
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.gameState = null;
    this.isRunning = false;
    this.animationFrameId = null;
  }

  start(initialState) {
    this.gameState = initialState;
    this.isRunning = true;
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updateState(newState) {
    this.gameState = newState;
  }

  gameLoop() {
    if (!this.isRunning) return;

    this.renderer.render(this.gameState);

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  reset() {
    this.stop();
    this.gameState = null;
  }
}
