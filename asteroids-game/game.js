// game.js

import Player from './player.js';
import Asteroid from './asteroid.js';
import Boss from './boss.js';
import Level from './level.js';
import UI from './ui.js';
import GameAudio from './audio.js';  // Update this line
import Leaderboard from './leaderboard.js';
import Input from './input.js';
import Collision from './collision.js';
import PowerUp from './powerup.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        this.ctx = this.canvas.getContext('2d');
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.aspectRatio = 10 / 9; // GameBoy Color aspect ratio
        this.resizeCanvas();

        this.player = new Player(this);
        this.level = new Level(this);
        this.ui = new UI(this);
        this.audio = new GameAudio();  // Update this line
        this.leaderboard = new Leaderboard();
        this.input = new Input(this);

        this.asteroids = [];
        this.boss = null;
        this.powerUps = [];
        this.gameState = 'menu'; // 'menu', 'playing', 'levelTransition', 'gameOver'

        this.score = 0;
        this.lives = 3;

        this.lastTime = 0;
        this.powerUpSpawnInterval = 1000; // Spawn a power-up every 1000 frames
        this.powerUpTimer = 0;

        this.preloadPowerUpImages();

        if (this.isMobile) {
            this.setupMobileControls();
        }

        this.fontLoaded = false;
        this.loadFont();
    }

    loadFont() {
        const font = new FontFace('PressStart2P', 'url(assets/fonts/PressStart2P-Regular.ttf)');
        font.load().then(() => {
            document.fonts.add(font);
            this.fontLoaded = true;
            this.ui.setFontSize(); // Refresh UI font after loading
        }).catch((error) => {
            console.warn('Failed to load custom font:', error);
            this.fontLoaded = true; // Proceed with fallback font
        });
    }

    setupMobileControls() {
        const mobileControls = document.querySelector('.mobile-controls');
        mobileControls.style.display = 'flex';

        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const shootBtn = document.getElementById('shootBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const soundBtn = document.getElementById('soundBtn');
        const musicBtn = document.getElementById('musicBtn');
        const menuBtn = document.getElementById('menuBtn');

        const handleTouch = (btn, keyCode, isDown) => {
            btn.addEventListener(isDown ? 'touchstart' : 'touchend', (e) => {
                e.preventDefault();
                this.input.keys[keyCode] = isDown;
            });
        };

        handleTouch(leftBtn, 'ArrowLeft', true);
        handleTouch(leftBtn, 'ArrowLeft', false);
        handleTouch(rightBtn, 'ArrowRight', true);
        handleTouch(rightBtn, 'ArrowRight', false);
        handleTouch(shootBtn, 'Space', true);
        handleTouch(shootBtn, 'Space', false);

        pauseBtn.addEventListener('click', () => this.togglePause());
        soundBtn.addEventListener('click', () => this.toggleSound());
        musicBtn.addEventListener('click', () => this.toggleMusic());
        menuBtn.addEventListener('click', () => this.showMenu());
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').querySelector('img').src = 'assets/icons/play.png';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').querySelector('img').src = 'assets/icons/pause.png';
        }
    }

    toggleSound() {
        this.audio.toggleSound();
        const soundBtn = document.getElementById('soundBtn').querySelector('img');
        soundBtn.src = this.audio.isSoundMuted ? 'assets/icons/sound-off.png' : 'assets/icons/sound-on.png';
    }

    toggleMusic() {
        this.audio.toggleMusic();
        const musicBtn = document.getElementById('musicBtn').querySelector('img');
        musicBtn.src = this.audio.isMusicMuted ? 'assets/icons/music-off.png' : 'assets/icons/music-on.png';
    }

    showMenu() {
        // Implement menu logic
        // For now, let's just redirect to the homepage
        window.location.href = 'https://moonshot-theta.vercel.app/#home';
    }

    preloadPowerUpImages() {
        const powerUpTypes = ['speedBoost', 'shield', 'multiShot', 'timeFreeze'];
        powerUpTypes.forEach(type => {
            const img = new Image();
            img.src = `assets/powerups/${type}.png`;
        });
    }

    reset() {
        this.asteroids = [];
        this.boss = null;
        this.powerUps = [];
        this.score = 0;
        this.lives = 3;
        this.gameState = 'menu';
        this.showGameOverScreen = false;
        this.powerUpTimer = 0;
        this.lastTime = 0;
        if (this.level) this.level.reset();
        if (this.player) this.player.reset();
    }

    init() {
        this.input.setupListeners();
        this.audio.loadSounds();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.showMainMenu();
        requestAnimationFrame(this.gameLoop.bind(this));
        this.waitForFontAndStart();
    }

    waitForFontAndStart() {
        if (this.fontLoaded) {
            this.startGame();
        } else {
            requestAnimationFrame(this.waitForFontAndStart.bind(this));
        }
    }

    resizeCanvas() {
        if (this.isMobile) {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const gameScreenHeight = screenHeight / 2;
            const canvasWidth = Math.min(screenWidth, gameScreenHeight * this.aspectRatio);
            const canvasHeight = canvasWidth / this.aspectRatio;

            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            this.canvas.style.width = `${canvasWidth}px`;
            this.canvas.style.height = `${canvasHeight}px`;
        } else {
            this.canvas.width = 800;
            this.canvas.height = 720;
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        if (this.player) this.player.setDimensions();
        if (this.ui) this.ui.setFontSize();
    }

    showMainMenu() {
        this.reset();
        this.gameState = 'menu';
        this.ui.showMainMenu(this.ctx);  // Pass this.ctx here
    }

    startGame() {
        this.reset();
        console.log('Game state changed to playing'); // Add this line
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level.start();
        this.audio.startMusic();
        this.gameLoop(0);  // Start the game loop
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        if (this.gameState === 'playing') {
            this.player.update(deltaTime);
            this.updateAsteroids(deltaTime);
            if (this.boss) {
                this.boss.update(deltaTime);
                if (this.boss.markedForDeletion) {
                    this.boss = null;
                }
            }
            this.updatePowerUps(deltaTime);
            this.level.update(deltaTime);
            Collision.handleCollisions(this);

            // Spawn power-ups
            this.powerUpTimer++;
            if (this.powerUpTimer >= this.powerUpSpawnInterval) {
                this.powerUps.push(PowerUp.spawnPowerUp(this));
                this.powerUpTimer = 0;
            }

            // Check for collisions with power-ups
            this.powerUps.forEach(powerUp => {
                if (Collision.checkCollision(this.player, powerUp)) {
                    powerUp.activate();
                    powerUp.markedForDeletion = true;
                }
            });
        }
    }

    render() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Always render the game elements, regardless of game state
        this.player.render(this.ctx);
        this.asteroids.forEach(asteroid => asteroid.render(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
        if (this.boss) this.boss.render(this.ctx);

        // Render UI elements
        this.ui.render(this.ctx);

        // If the game is paused, render a semi-transparent overlay with "PAUSED" text
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#0ff';
            this.ctx.font = `${this.ui.fontSize * 2}px ${this.ui.fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        }

        // Show boss defeated message
        if (this.level.state === 'bossDefeated') {
            this.ui.showBossDefeatedMessage(this.ctx);
        }

        // Show game over screen if flag is set
        if (this.showGameOverScreen) {
            this.ui.showGameOver(this.ctx);
        }
    }

    updateAsteroids(deltaTime) {
        this.asteroids.forEach(asteroid => asteroid.update(deltaTime));
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.markedForDeletion);
    }

    updatePowerUps(deltaTime) {
        this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.markedForDeletion);
    }

    addAsteroid() {
        this.asteroids.push(new Asteroid(this));
    }

    spawnBoss() {
        this.boss = new Boss(this, this.level.currentLevel);
    }

    addPowerUp(x, y) {
        this.powerUps.push(new PowerUp(this, x, y));
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.audio.stopMusic();
        this.audio.playSound('explode');
        this.leaderboard.addScore(this.score);
        // Instead of calling UI method directly, set a flag
        this.showGameOverScreen = true;
    }

    gameWon() {
        this.gameState = 'gameOver';
        this.audio.stopMusic();
        this.audio.playSound('victory');
        this.leaderboard.addScore(this.score);
        this.ui.showGameWon();
    }

    // Remove or comment out the applyCRTEffect method if it's not needed
    /*
    applyCRTEffect() {
        const originalImageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = originalImageData.data;

        for (let y = 0; y < this.height; y += 3) {
            for (let x = 0; x < this.width; x++) {
                const index = (y * this.width + x) * 4;
                data[index] = data[index] * 1.2;  // Red
                data[index + 1] = data[index + 1] * 0.9;  // Green
                data[index + 2] = data[index + 2] * 0.9;  // Blue
            }
        }

        this.ctx.putImageData(originalImageData, 0, 0);
    }
    */
}

export default Game;