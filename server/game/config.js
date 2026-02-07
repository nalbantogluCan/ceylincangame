module.exports = {
  // Grid dimensions
  GRID_WIDTH: 10,
  GRID_HEIGHT: 10,
  CELL_SIZE: 60,

  // Game timing
  GAME_DURATION: 120, // seconds
  TICK_RATE: 50, // milliseconds (20 ticks per second)

  // Scoring
  BONE_POINTS: 10,
  POOP_POINTS: -5,

  // Item spawning
  MAX_ITEMS: 5,
  ITEM_SPAWN_INTERVAL: 2500, // milliseconds
  BONE_SPAWN_RATE: 0.7, // 70% chance for bones, 30% for poop

  // Player spawn positions (opposite corners)
  PLAYER_SPAWNS: [
    { x: 1, y: 1 },      // Player 1
    { x: 8, y: 8 }       // Player 2
  ],

  // Directions
  DIRECTIONS: {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
  },

  // Player colors
  PLAYER_COLORS: ['#FFB6D9', '#C9A9E9'] // Kawaii Pink and Purple
};
