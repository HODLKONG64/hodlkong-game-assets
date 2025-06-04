
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load assets
const assets = {
    player: loadImage('assets/player.png'),
    platform: loadImage('assets/platform.png'),
    ladder: loadImage('assets/ladder.png'),
    coin: loadImage('assets/coin.png'),
    enemy: loadImage('assets/coin.png'), // Replace with enemy image later
    powerup: loadImage('assets/coin.png') // Placeholder for power-up
};

// Game state
let player = {
    x: 100,
    y: 300,
    width: 32,
    height: 32,
    speed: 1
};
let mouseX = player.x;
let mouseY = player.y;
let score = 0;
let level = 1;
let lives = 3;
let enemySpeed = 2;
let powerUps = [];
let powerUpActive = false;
let powerUpTimer = 0;
let hasNFTPower = false; // NFT gate logic placeholder

let platforms = [];
let ladders = [];
let coins = [];
let enemies = [];

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

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

    enemies = Array.from({ length: lvl }, () => ({
        x: Math.random() * canvas.width,
        y: -50,
        width: 24,
        height: 24
    }));

    powerUps = [
        { x: Math.random() * canvas.width, y: Math.random() * canvas.height, active: true }
    ];
}

function updatePlayerPosition() {
    let dx = mouseX - player.x;
    let dy = mouseY - player.y;
    player.x += dx * 0.1 * player.speed;
    player.y += dy * 0.1 * player.speed;
}

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

    if (coins.every(c => c.collected)) {
        level++;
        document.getElementById("level").textContent = level;
        initLevel(level);
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemy.y = -50;
            enemy.x = Math.random() * canvas.width;
        }

        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            enemy.y = -50;
            enemy.x = Math.random() * canvas.width;
            if (!powerUpActive) {
                lives--;
                document.getElementById("lives").textContent = lives;
                if (lives <= 0) {
                    alert("Game Over!");
                    resetGame();
                }
            }
        }
    });
}

function updatePowerUps() {
    powerUps.forEach(power => {
        if (power.active &&
            player.x < power.x + 24 &&
            player.x + player.width > power.x &&
            player.y < power.y + 24 &&
            player.y + player.height > power.y) {
            power.active = false;
            activatePowerUp();
        }
    });

    if (powerUpActive) {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
            powerUpActive = false;
            player.speed = 1;
        }
    }
}

function activatePowerUp() {
    powerUpActive = true;
    powerUpTimer = 300; // frames (5 seconds at 60fps)
    player.speed = 2;   // Speed boost
}

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

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    platforms.forEach(p => ctx.drawImage(assets.platform, p.x, p.y, 200, 40));
    ladders.forEach(l => ctx.drawImage(assets.ladder, l.x, l.y, 32, 100));
    coins.forEach(c => !c.collected && ctx.drawImage(assets.coin, c.x, c.y, 24, 24));
    enemies.forEach(e => ctx.drawImage(assets.enemy, e.x, e.y, e.width, e.height));
    powerUps.forEach(p => p.active && ctx.drawImage(assets.powerup, p.x, p.y, 24, 24));
    ctx.drawImage(assets.player, player.x, player.y, player.width, player.height);
}

function gameLoop() {
    updatePlayerPosition();
    updateEnemies();
    updatePowerUps();
    checkCoinCollection();
    checkGameBoundaries();
    drawGame();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    powerUpActive = false;
    player.speed = hasNFTPower ? 1.5 : 1;
    player.x = 100;
    player.y = 300;
    document.getElementById("score").textContent = score;
    document.getElementById("level").textContent = level;
    document.getElementById("lives").textContent = lives;
    initLevel(level);
}

// Placeholder: Simulate NFT unlock
function simulateNFTUnlock() {
    // Replace this with real WAX wallet/NFT check logic
    hasNFTPower = true;
    console.log("NFT detected! Player boost enabled.");
}

assets.player.onload = () => {
    simulateNFTUnlock(); // simulate NFT benefits
    resetGame();
    gameLoop();
};
