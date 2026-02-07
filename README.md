# Dog Walking Game

A fun multiplayer web-based game where two players control dogs on a grid, collecting bones and avoiding poop to score the most points within a time limit!

## Features

- Real-time online multiplayer (2 players)
- Simple room-based matchmaking with 6-digit codes
- Snake-like movement mechanics
- Bones (+10 points) and poop (-5 points)
- 2-minute timed matches
- Responsive and colorful UI

## Game Rules

1. Create a room or join with a room code
2. Use arrow keys to move your dog
3. Collect bones to gain +10 points
4. Avoid poop to prevent losing -5 points
5. The player with the most points when the timer ends wins!

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (if not already done):
```bash
npm install
```

## Running the Game

### Start the Server

From the `server` directory, run:
```bash
npm start
```

or

```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
Access from other devices using your local IP on port 3000
```

### Playing Locally (Same Computer)

1. Open your browser and go to `http://localhost:3000`
2. Click "Create Game" and note the room code
3. Open a new browser window or incognito window
4. Enter the room code and click "Join Game"
5. The game starts automatically when both players are connected!

### Playing from Different Computers (Same Network)

1. Find your computer's local IP address:
   - **Mac/Linux**: Run `ifconfig` in terminal, look for `inet` address (e.g., 192.168.1.100)
   - **Windows**: Run `ipconfig` in command prompt, look for IPv4 Address

2. Start the server (it already listens on `0.0.0.0`)

3. On the other computer, open browser and go to:
   ```
   http://[YOUR_IP]:3000
   ```
   (Replace `[YOUR_IP]` with your actual IP address)

4. One player creates a room, the other joins with the code

### Controls

- **Arrow Keys**: Move your dog (Up, Down, Left, Right)

### Game Info

- **Grid**: 40x30 cells
- **Duration**: 120 seconds (2 minutes)
- **Tick Rate**: 20 updates per second
- **Max Items**: 10 items on grid at once
- **Player 1**: Blue dog
- **Player 2**: Orange dog
- **Bone**: White/beige (70% spawn rate)
- **Poop**: Brown (30% spawn rate)

## Project Structure

```
ceylingame/
├── server/
│   ├── server.js           # Main server entry point
│   ├── package.json        # Dependencies
│   ├── game/
│   │   ├── GameRoom.js    # Game session manager
│   │   ├── GameState.js   # Core game logic
│   │   ├── Dog.js         # Dog entity
│   │   ├── Item.js        # Item entity
│   │   └── config.js      # Game constants
│   └── utils/
│       └── idGenerator.js # Room code generator
├── public/
│   ├── index.html         # Main HTML page
│   ├── css/
│   │   └── styles.css     # All styling
│   └── js/
│       ├── main.js        # Client entry point
│       ├── game/
│       │   ├── GameClient.js   # Client game controller
│       │   ├── Renderer.js     # Canvas rendering
│       │   ├── InputHandler.js # Keyboard input
│       │   └── config.js       # Client constants
│       ├── network/
│       │   └── NetworkManager.js # Socket.io wrapper
│       └── ui/
│           └── UIManager.js     # UI management
└── README.md
```

## Troubleshooting

### Port 3000 Already in Use

If you get an error that port 3000 is already in use, you can:

1. Kill the process using port 3000, or
2. Change the port in `server/server.js`:
   ```javascript
   const PORT = process.env.PORT || 3001; // Change to 3001 or any other port
   ```

### Can't Connect from Other Computer

- Make sure both computers are on the same network
- Check firewall settings to allow connections on port 3000
- Verify you're using the correct local IP address
- Try disabling VPN if active

### Game Feels Laggy

- Check your network connection
- Close other bandwidth-heavy applications
- Try playing on the same computer first to rule out network issues

## Technologies Used

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5 Canvas, CSS3
- **Real-time Communication**: WebSockets via Socket.io

## Future Enhancements

- Power-ups (speed boost, shields)
- Obstacles and walls
- Multiple game modes
- Sound effects and music
- Animated sprites
- Mobile touch controls
- Leaderboard system

## License

This is a personal project created for fun!

Enjoy playing! 🐕🦴💩
