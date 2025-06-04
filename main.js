
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

// Game state
let player = {
    x: 100,
    y: 300,
    width: 32,
    height: 32
};
let mouseX = player.x;
let mouseY = player.y;
let score = 0;
let level = 1;
let lives = 3;

// Platform positions
let platforms = [];
// Ladders
let ladders = [];
// Coins
let coins = [];

function initLevel(lvl) {
    platforms = [
        { x: 50, y: 500 },
        { x: 300, y: 400 },
        { x: 600, y: 300 }
    ];

    ladders = [
        { x: 320, y: 350 },
        { x: 620, y: 250 }
    ];

    coins = Array.from({ length: 3 + lvl }, (_, i) => ({
        x: 100 + i * 150,
        y: 470 - (i % 3) * 100,
        collected: false
    }));
}

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

// Check collision with coin
function checkCoinCollection() {
    coins.forEach(coin => {
        if (!coin.collected &&
            player.x < coin.x + 24 &&
            player.x + player.width > coin.x &&
            player.y < coin.y + 24 &&
            player.y + player.height > coin.y) {
            coin.collected = true;
            score += 10;
            document.getElementById("score").textContent = score;
        }
    });

    // Check if all coins collected
    if (coins.every(c => c.collected)) {
        level++;
        document.getElementById("level").textContent = level;
        initLevel(level);
    }
}

// Simulate losing a life when player touches edges
function checkGameBoundaries() {
    if (player.x < 0 || player.x > canvas.width || player.y < 0 || player.y > canvas.height) {
        lives--;
        document.getElementById("lives").textContent = lives;
        if (lives <= 0) {
            alert("Game Over!");
            resetGame();
        } else {
            player.x = 100;
            player.y = 300;
        }
    }
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
        if (!c.collected) {
            ctx.drawImage(assets.coin, c.x, c.y, 24, 24);
        }
    });

    // Draw player
    ctx.drawImage(assets.player, player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    updatePlayerPosition();
    checkCoinCollection();
    checkGameBoundaries();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Mouse movement
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Start the game
function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    player.x = 100;
    player.y = 300;
    document.getElementById("score").textContent = score;
    document.getElementById("level").textContent = level;
    document.getElementById("lives").textContent = lives;
    initLevel(level);
}

assets.player.onload = () => {
    resetGame();
    gameLoop();
};
