const { DIRECTIONS, GRID_WIDTH, GRID_HEIGHT } = require('./config');

class Dog {
  constructor(playerId, x, y, color, dogName = 'dog1') {
    this.playerId = playerId;
    this.x = x;
    this.y = y;
    this.color = color;
    this.dogName = dogName; // dog1, dog2, dog3, dog4, or dog5
  }

  move(direction) {
    // Only move if a valid direction is provided
    if (!direction || !DIRECTIONS[direction]) {
      return;
    }

    const dir = DIRECTIONS[direction];
    this.x += dir.x;
    this.y += dir.y;

    // Wrap around edges (toroidal map)
    if (this.x < 0) this.x = GRID_WIDTH - 1;
    if (this.x >= GRID_WIDTH) this.x = 0;
    if (this.y < 0) this.y = GRID_HEIGHT - 1;
    if (this.y >= GRID_HEIGHT) this.y = 0;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  toJSON() {
    return {
      playerId: this.playerId,
      x: this.x,
      y: this.y,
      color: this.color,
      dogName: this.dogName
    };
  }
}

module.exports = Dog;
