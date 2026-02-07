const Dog = require('./Dog');
const Item = require('./Item');
const {
  GAME_DURATION,
  TICK_RATE,
  PLAYER_SPAWNS,
  PLAYER_COLORS,
  MAX_ITEMS,
  BONE_SPAWN_RATE,
  GRID_WIDTH,
  GRID_HEIGHT
} = require('./config');

class GameState {
  constructor(dogSelections = {}) {
    this.dogs = [];
    this.items = [];
    this.scores = [0, 0]; // Player 1 and Player 2 scores
    this.timeRemaining = GAME_DURATION;
    this.gameOver = false;
    this.winner = null;
    this.lastItemSpawn = Date.now();

    // Initialize dogs at spawn positions with selected dog names
    for (let i = 0; i < 2; i++) {
      const spawn = PLAYER_SPAWNS[i];
      const dogName = dogSelections[i] || `dog${i + 1}`; // Default to dog1/dog2 if not selected
      this.dogs.push(new Dog(i, spawn.x, spawn.y, PLAYER_COLORS[i], dogName));
    }

    // Spawn initial items
    for (let i = 0; i < 5; i++) {
      this.spawnItem();
    }
  }

  update() {
    if (this.gameOver) return;

    // Update timer
    this.timeRemaining -= TICK_RATE / 1000;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.gameOver = true;
      this.winner = this.getWinner();
      return;
    }

    // Dogs only move when player presses a key (handled in handlePlayerInput)
    // No automatic movement

    // Check collisions
    this.checkCollisions();

    // Spawn new items periodically
    const now = Date.now();
    if (now - this.lastItemSpawn >= 2500 && this.items.length < MAX_ITEMS) {
      this.spawnItem();
      this.lastItemSpawn = now;
    }
  }

  handlePlayerInput(playerId, direction) {
    if (this.gameOver) return;

    const dog = this.dogs.find(d => d.playerId === playerId);
    if (dog) {
      // Move the dog immediately when input is received
      dog.move(direction);
      // Check for collisions after movement
      this.checkCollisions();
    }
  }

  checkCollisions() {
    this.dogs.forEach(dog => {
      // Check dog-item collisions
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (dog.x === item.x && dog.y === item.y) {
          // Collision detected
          this.scores[dog.playerId] += item.value;
          this.items.splice(i, 1);

          // Spawn a new item to replace the collected one
          this.spawnItem();
        }
      }
    });
  }

  spawnItem() {
    if (this.items.length >= MAX_ITEMS) return;

    let x, y;
    let attempts = 0;
    const maxAttempts = 100;

    // Find a valid spawn position (not on a dog or existing item)
    do {
      x = Math.floor(Math.random() * GRID_WIDTH);
      y = Math.floor(Math.random() * GRID_HEIGHT);
      attempts++;

      // Avoid infinite loop
      if (attempts > maxAttempts) return;
    } while (this.isPositionOccupied(x, y));

    // 70% chance for bone, 30% for poop
    const type = Math.random() < BONE_SPAWN_RATE ? 'bone' : 'poop';
    this.items.push(new Item(x, y, type));
  }

  isPositionOccupied(x, y) {
    // Check if position is on any dog
    const onDog = this.dogs.some(dog => dog.x === x && dog.y === y);
    if (onDog) return true;

    // Check if position has an item
    const onItem = this.items.some(item => item.x === x && item.y === y);
    return onItem;
  }

  getWinner() {
    if (this.scores[0] > this.scores[1]) return 0;
    if (this.scores[1] > this.scores[0]) return 1;
    return null; // Tie
  }

  isGameOver() {
    return this.gameOver;
  }

  toJSON() {
    return {
      dogs: this.dogs.map(dog => dog.toJSON()),
      items: this.items.map(item => item.toJSON()),
      scores: this.scores,
      timeRemaining: Math.max(0, Math.round(this.timeRemaining)),
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}

module.exports = GameState;
