import { CONFIG } from './config.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Image assets - will be null if images don't exist
    this.images = {
      dog1: this.loadImage('/assets/images/dog1.png'),
      dog2: this.loadImage('/assets/images/dog2.png'),
      dog3: this.loadImage('/assets/images/dog3.png'),
      dog4: this.loadImage('/assets/images/dog4.png'),
      dog5: this.loadImage('/assets/images/dog5.png'),
      bone: this.loadImage('/assets/images/bone.png'),
      poop: this.loadImage('/assets/images/poop.png')
    };
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    // Return null if image fails to load
    img.onerror = () => {
      console.log(`Image ${src} not found, using shapes instead`);
      return null;
    };
    return img;
  }

  clear() {
    this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
  }

  drawGrid() {
    this.ctx.strokeStyle = CONFIG.COLORS.GRID_LINE;
    this.ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
      const pixelX = x * CONFIG.CELL_SIZE;
      this.ctx.beginPath();
      this.ctx.moveTo(pixelX, 0);
      this.ctx.lineTo(pixelX, CONFIG.CANVAS_HEIGHT);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
      const pixelY = y * CONFIG.CELL_SIZE;
      this.ctx.beginPath();
      this.ctx.moveTo(0, pixelY);
      this.ctx.lineTo(CONFIG.CANVAS_WIDTH, pixelY);
      this.ctx.stroke();
    }
  }

  drawDog(dog) {
    const pixelX = dog.x * CONFIG.CELL_SIZE;
    const pixelY = dog.y * CONFIG.CELL_SIZE;

    // Try to draw custom image first using dogName
    const dogImage = this.images[dog.dogName] || this.images.dog1;
    if (dogImage && dogImage.complete && dogImage.naturalWidth > 0) {
      // Draw the custom image
      this.ctx.drawImage(
        dogImage,
        pixelX + 2,
        pixelY + 2,
        CONFIG.CELL_SIZE - 4,
        CONFIG.CELL_SIZE - 4
      );
    } else {
      // Fallback to kawaii rounded rectangle
      this.ctx.fillStyle = dog.color;
      this.ctx.beginPath();
      this.ctx.roundRect(
        pixelX + 4,
        pixelY + 4,
        CONFIG.CELL_SIZE - 8,
        CONFIG.CELL_SIZE - 8,
        10
      );
      this.ctx.fill();

      // Add kawaii face
      this.ctx.fillStyle = '#000';
      const centerX = pixelX + CONFIG.CELL_SIZE / 2;
      const centerY = pixelY + CONFIG.CELL_SIZE / 2;

      // Eyes
      this.ctx.beginPath();
      this.ctx.arc(centerX - 8, centerY - 5, 3, 0, Math.PI * 2);
      this.ctx.arc(centerX + 8, centerY - 5, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Smile
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY + 3, 8, 0.2, Math.PI - 0.2);
      this.ctx.stroke();
    }
  }

  drawItem(item) {
    const pixelX = item.x * CONFIG.CELL_SIZE;
    const pixelY = item.y * CONFIG.CELL_SIZE;
    const centerX = pixelX + CONFIG.CELL_SIZE / 2;
    const centerY = pixelY + CONFIG.CELL_SIZE / 2;

    if (item.type === CONFIG.ITEM_TYPES.BONE) {
      // Try custom bone image first
      if (this.images.bone && this.images.bone.complete && this.images.bone.naturalWidth > 0) {
        this.ctx.drawImage(
          this.images.bone,
          pixelX + 10,
          pixelY + 10,
          CONFIG.CELL_SIZE - 20,
          CONFIG.CELL_SIZE - 20
        );
      } else {
        // Kawaii bone
        this.ctx.fillStyle = CONFIG.COLORS.BONE;
        this.ctx.strokeStyle = '#FFE082';
        this.ctx.lineWidth = 2;

        const radius = 6;
        this.ctx.beginPath();
        this.ctx.arc(centerX - 10, centerY, radius, 0, Math.PI * 2);
        this.ctx.arc(centerX + 10, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillRect(centerX - 10, centerY - 3, 20, 6);
        this.ctx.strokeRect(centerX - 10, centerY - 3, 20, 6);
      }
    } else if (item.type === CONFIG.ITEM_TYPES.POOP) {
      // Try custom poop image first
      if (this.images.poop && this.images.poop.complete && this.images.poop.naturalWidth > 0) {
        this.ctx.drawImage(
          this.images.poop,
          pixelX + 10,
          pixelY + 10,
          CONFIG.CELL_SIZE - 20,
          CONFIG.CELL_SIZE - 20
        );
      } else {
        // Kawaii poop
        this.ctx.fillStyle = CONFIG.COLORS.POOP;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + 5, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(centerX - 5, centerY, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(centerX + 5, centerY, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // Kawaii sparkle
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(centerX + 3, centerY - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  render(gameState) {
    if (!gameState) return;

    this.clear();
    this.drawGrid();

    // Draw items
    if (gameState.items) {
      gameState.items.forEach(item => this.drawItem(item));
    }

    // Draw dogs
    if (gameState.dogs) {
      gameState.dogs.forEach(dog => this.drawDog(dog));
    }
  }

  darkenColor(color) {
    // Simple color darkening for borders
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
