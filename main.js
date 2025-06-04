
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio setup
const bgMusic = new Audio('audio/bgmusic.wav');
bgMusic.loop = true;
bgMusic.volume = 0.3;

const sfx = {
    coin: new Audio('audio/coin.wav'),
    enemy: new Audio('audio/enemy_hit.wav'),
    powerup: new Audio('audio/powerup.wav'),
    gameover: new Audio('audio/gameover.wav')
};

// Toggle music
const toggleBtn = document.getElementById('toggleMusic');
let musicOn = true;
bgMusic.play();

toggleBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) {
        bgMusic.play();
        toggleBtn.textContent = '🔊 On';
    } else {
        bgMusic.pause();
        toggleBtn.textContent = '🔇 Off';
    }
});

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
    height: 32,
    lives: 3,
    score: 0,
    level: 1
};

// Mouse position
let mouseX = player.x;
let mouseY = player.y;

// World elements
const platforms = [
    { x: 50, y: 500 },
    { x: 300, y: 400 },
    { x: 600, y: 300 }
];

const ladders = [
    { x: 320, y: 350 },
    { x: 620, y: 250 }
];

const coins = [
    { x: 100, y: 470 },
    { x: 350, y: 370 },
    { x: 650, y: 270 }
];

const enemies = [
    { x: 200, y: 0, vy: 2 },
    { x: 500, y: -100, vy: 2.5 }
];

const powerups = [
    { x: 400, y: 100 }
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

// Collision detection
function isColliding(a, b, aw = 32, ah = 32, bw = 32, bh = 32) {
    return (
        a.x < b.x + bw &&
        a.x + aw > b.x &&
        a.y < b.y + bh &&
        a.y + ah > b.y
    );
}

// Draw everything
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(p => ctx.drawImage(assets.platform, p.x, p.y, 200, 40));
    ladders.forEach(l => ctx.drawImage(assets.ladder, l.x, l.y, 32, 100));
    coins.forEach(c => ctx.drawImage(assets.coin, c.x, c.y, 24, 24));
    powerups.forEach(p => ctx.drawImage(assets.coin, p.x, p.y, 24, 24)); // placeholder icon
    enemies.forEach(e => ctx.drawImage(assets.coin, e.x, e.y, 24, 24)); // placeholder

    ctx.drawImage(assets.player, player.x, player.y, player.width, player.height);
}

// Update and animate game elements
function updateGame() {
    updatePlayerPosition();

    // Coins
    coins.forEach((coin, i) => {
        if (isColliding(player, coin, 32, 32, 24, 24)) {
            coins.splice(i, 1);
            player.score += 10;
            document.getElementById("score").textContent = player.score;
            sfx.coin.play();
        }
    });

    // Power-ups
    powerups.forEach((pu, i) => {
        if (isColliding(player, pu)) {
            powerups.splice(i, 1);
            sfx.powerup.play();
            // Example: NFT boost = faster speed temporarily
        }
    });

    // Enemies
    enemies.forEach((e, i) => {
        e.y += e.vy;
        if (isColliding(player, e)) {
            enemies[i].y = -50;
            player.lives -= 1;
            document.getElementById("lives").textContent = player.lives;
            sfx.enemy.play();
        }
    });

    // Level up
    if (player.score >= 100 * player.level) {
        player.level += 1;
        document.getElementById("level").textContent = player.level;
        enemies.push({ x: Math.random() * canvas.width, y: -50, vy: 2 + player.level * 0.5 });
    }

    // Game over
    if (player.lives <= 0) {
        sfx.gameover.play();
        alert("Game Over! Refresh to play again.");
        document.location.reload();
    }
}

// Game loop
function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Mouse tracking
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Start game
assets.player.onload = () => gameLoop();


// WAX Login
const wax = new waxjs.WaxJS({
  rpcEndpoint: 'https://wax.greymass.com'
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const userAccount = await wax.login();
    document.getElementById("walletStatus").innerText = `✅ Connected: ${userAccount}`;
    window.userWallet = userAccount;
  } catch (e) {
    document.getElementById("walletStatus").innerText = "❌ Login Failed";
  }
});
