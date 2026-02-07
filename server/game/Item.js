const { BONE_POINTS, POOP_POINTS } = require('./config');

class Item {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'bone' or 'poop'
    this.value = type === 'bone' ? BONE_POINTS : POOP_POINTS;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
      value: this.value
    };
  }
}

module.exports = Item;
