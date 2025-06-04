
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load assets
const assets = {
    player: loadImage('assets/player.png'),
    platform: loadImage('assets/platform.png'),
    ladder: loadImage('assets/ladder.png'),
    coin: loadImage('assets/coin.png')
};

// Player object
let player = {
    x: 100,
    y: 300,
    width: 32,
    height: 32
};

// Mouse position
let mouseX = player.x;
let mouseY = player.y;

// Platform positions
const platforms = [
    { x: 50, y: 500 },
    { x: 300, y: 400 },
    { x: 600, y: 300 }
];

// Ladders
const ladders = [
    { x: 320, y: 350 },
    { x: 620, y: 250 }
];

// Coins
const coins = [
    { x: 100, y: 470 },
    { x: 350, y: 370 },
    { x: 650, y: 270 }
];

// Load image utility
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// Update player to follow mouse
function updatePlayerPosition() {
    let dx = mouseX - player.x;
    let dy = mouseY - player.y;
    player.x += dx * 0.1;
    player.y += dy * 0.1;
}

// Draw everything
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(p => {
        ctx.drawImage(assets.platform, p.x, p.y, 200, 40);
    });

    // Draw ladders
    ladders.forEach(l => {
        ctx.drawImage(assets.ladder, l.x, l.y, 32, 100);
    });

    // Draw coins
    coins.forEach(c => {
        ctx.drawImage(assets.coin, c.x, c.y, 24, 24);
    });

    // Draw player
    ctx.drawImage(assets.player, player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    updatePlayerPosition();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Mouse movement
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Start game once player image is loaded
assets.player.onload = () => {
    gameLoop();
};
