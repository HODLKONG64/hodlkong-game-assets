
// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load assets
const playerImg = new Image();
playerImg.src = 'assets/player.png';  // Make sure this file exists in assets/

let player = {
    x: 100,
    y: 500,
    width: 32,
    height: 32
};

// Track mouse position
let mouseX = player.x;
let mouseY = player.y;

// Smooth follow function
function updatePlayerPosition() {
    let dx = mouseX - player.x;
    let dy = mouseY - player.y;
    player.x += dx * 0.1;
    player.y += dy * 0.1;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayerPosition();

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    requestAnimationFrame(gameLoop);
}

// Mouse movement event listener
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Start the game
playerImg.onload = function() {
    gameLoop();
};
