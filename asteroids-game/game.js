// game.js

import Player from './player.js';
import Asteroid from './asteroid.js';
import Boss from './boss.js';
import Level from './level.js';
import UI from './ui.js';
import GameAudio from './audio.js';
import Input from './input.js';
import Collision from './collision.js';
import PowerUp from './powerup.js';
import Bullet from './bullet.js';
import BossBullet from './bossBullet.js';
import Minion from './minion.js';

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
        this.audio = new GameAudio();
        this.input = new Input(this);

        this.asteroids = [];
        this.boss = null;
        this.powerUps = [];
        this.minions = [];
        this.gameState = 'openingCrawl'; // Change initial state to 'openingCrawl'
        this.crawlStartTime = null; // Added to track opening crawl start time
        this.menuActive = false;

        this.score = 0;
        this.lives = 3;

        this.lastTime = 0;
        this.powerUpSpawnInterval = 1000; // Spawn a power-up every 1000 frames
        this.powerUpTimer = 0;

        this.showingInitialBriefing = true;
        this.showingStoryRecap = false;

        this.preloadPowerUpImages();

        if (this.isMobile) {
            this.setupMobileControls();
        }

        this.fontLoaded = false;
        this.loadFont();
        this.gameLoopStarted = false;

        this.debugMode = false;

        this.assetsLoaded = false;
        this.imagesToLoad = [
            { name: 'player', src: 'assets/ships/pixel_ship.png' },
            { name: 'asteroid', src: 'assets/asteroids/asteroid_1.png' },
            { name: 'speedBoost', src: 'assets/powerups/speedBoost.png' },
            { name: 'shield', src: 'assets/powerups/shield.png' },
            { name: 'multiShot', src: 'assets/powerups/multiShot.png' },
            { name: 'timeFreeze', src: 'assets/powerups/timeFreeze.png' },
            { name: 'life', src: 'assets/powerups/life.png' },
            { name: 'duplicate', src: 'assets/powerups/duplicate.png' },
            { name: 'laserShots', src: 'assets/powerups/laserShots.png' },
            // Add all planet images
            { name: 'mercury', src: 'assets/planets/mercury.png' },
            { name: 'venus', src: 'assets/planets/venus.png' },
            { name: 'earth', src: 'assets/planets/earth.png' },
            { name: 'mars', src: 'assets/planets/mars.png' },
            { name: 'jupiter', src: 'assets/planets/jupiter.png' },
            { name: 'saturn', src: 'assets/planets/saturn.png' },
            { name: 'uranus', src: 'assets/planets/uranus.png' },
            { name: 'neptune', src: 'assets/planets/neptune.png' },
            { name: 'pluto', src: 'assets/planets/pluto.png' },
            { name: 'ocean_world_alpha', src: 'assets/planets/ocean_world_alpha.png' },
            { name: 'ocean_world_beta', src: 'assets/planets/ocean_world_beta.png' },
            { name: 'ocean_world_prime', src: 'assets/planets/ocean_world_prime.png' },
            { name: 'tm_01', src: 'assets/planets/tm_01.png' },
            { name: 'tm_02', src: 'assets/planets/tm_02.png' },
            { name: 'tm_03', src: 'assets/planets/tm_03.png' },
            { name: 'spnv_01', src: 'assets/planets/spnv_01.png' },
            { name: 'spnv_02', src: 'assets/planets/spnv_02.png' },
            { name: 'dyson_alpha', src: 'assets/planets/dyson_alpha.png' },
            { name: 'dyson_beta', src: 'assets/planets/dyson_beta.png' },
            { name: 'dyson_gamma', src: 'assets/planets/dyson_gamma.png' },
            { name: 'dyson_omega', src: 'assets/planets/dyson_omega.png' },
            { name: 'dyson_prime', src: 'assets/planets/dyson_prime.png' },
            { name: 'x_prime', src: 'assets/planets/x_prime.png' },
            { name: 'x49_prime', src: 'assets/planets/x49_prime.png' },
            { name: 'terra', src: 'assets/planets/terra.png' },
        ];
        this.loadedImages = {};
        this.bullet = new Bullet(this, 0, 0); // Create a dummy bullet to trigger static initialization

        this.setupDesktopControls();
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

        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.input.keys['Space'] = true;
            if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                this.startGame();
            }
        });
        shootBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.keys['Space'] = false;
        });

        pauseBtn.addEventListener('click', () => this.togglePause());
        soundBtn.addEventListener('click', () => this.toggleSound());
        musicBtn.addEventListener('click', () => this.toggleMusic());
        menuBtn.addEventListener('click', () => this.toggleMenu());
    }

    setupDesktopControls() {
        const desktopPauseBtn = document.getElementById('desktopPauseBtn');
        const desktopSoundBtn = document.getElementById('desktopSoundBtn');
        const desktopMusicBtn = document.getElementById('desktopMusicBtn');
        const desktopMenuBtn = document.getElementById('desktopMenuBtn');

        desktopPauseBtn.addEventListener('click', () => this.togglePause());
        desktopSoundBtn.addEventListener('click', () => this.toggleSound());
        desktopMusicBtn.addEventListener('click', () => this.toggleMusic());
        desktopMenuBtn.addEventListener('click', () => this.toggleMenu());

        this.updateButtonStates();
    }

    updateButtonStates() {
        const pauseBtn = document.getElementById('desktopPauseBtn');
        const soundBtn = document.getElementById('desktopSoundBtn');
        const musicBtn = document.getElementById('desktopMusicBtn');

        pauseBtn.querySelector('img').src = this.gameState === 'paused' ? 'assets/icons/play.png' : 'assets/icons/pause.png';
        soundBtn.querySelector('img').src = this.audio.isSoundMuted ? 'assets/icons/sound-off.png' : 'assets/icons/sound-on.png';
        musicBtn.querySelector('img').src = this.audio.isMusicMuted ? 'assets/icons/music-off.png' : 'assets/icons/music-on.png';

        soundBtn.classList.toggle('active', !this.audio.isSoundMuted);
        musicBtn.classList.toggle('active', !this.audio.isMusicMuted);
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').querySelector('img').src = 'assets/icons/play.png';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').querySelector('img').src = 'assets/icons/pause.png';
        }
        this.updateButtonStates();
    }

    toggleSound() {
        this.audio.toggleSound();
        const soundBtn = document.getElementById('soundBtn');
        const soundImg = soundBtn.querySelector('img');
        soundImg.src = this.audio.isSoundMuted ? 'assets/icons/sound-off.png' : 'assets/icons/sound-on.png';
        soundBtn.classList.toggle('active', !this.audio.isSoundMuted);
        this.updateButtonStates();
    }

    toggleMusic() {
        this.audio.toggleMusic();
        const musicBtn = document.getElementById('musicBtn');
        const musicImg = musicBtn.querySelector('img');
        musicImg.src = this.audio.isMusicMuted ? 'assets/icons/music-off.png' : 'assets/icons/music-on.png';
        musicBtn.classList.toggle('active', !this.audio.isMusicMuted);
        this.updateButtonStates();
    }

    toggleMenu() {
        this.menuActive = !this.menuActive;
        if (this.menuActive) {
            this.gameState = 'menu';
        } else {
            this.gameState = 'playing';
        }
    }

    preloadPowerUpImages() {
        const powerUpTypes = ['speedBoost', 'shield', 'multiShot', 'timeFreeze', 'life', 'duplicate', 'laserShots'];
        powerUpTypes.forEach(type => {
            const img = new Image();
            img.src = `assets/powerups/${type}.png`;
        });
    }

    reset() {
        this.asteroids = [];
        this.boss = null;
        this.powerUps = [];
        this.minions = [];
        this.score = 0;
        this.lives = 3;
        this.gameState = 'menu';
        this.showGameOverScreen = false;
        this.powerUpTimer = 0;
        this.lastTime = 0;
        if (this.level) this.level.reset();
        if (this.player) this.player.reset();
    }

    async loadAssets() {
        const imagePromises = this.imagesToLoad.map(img => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    this.loadedImages[img.name] = image;
                    resolve();
                };
                image.onerror = () => reject(`Failed to load image: ${img.src}`);
                image.src = img.src;
            });
        });

        try {
            await Promise.all([
                ...imagePromises,
                Bullet.preloadImage(),
                BossBullet.preloadImage(),
                PowerUp.preloadImages()
            ]);
            this.assetsLoaded = true;
        } catch (error) {
            console.error('Failed to load assets:', error);
        }
    }

    async init() {
        await this.loadAssets();
        this.input.setupListeners();
        this.audio.loadSounds();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Start the game loop
        this.gameLoop(0);
    
        //this.waitForFontAndStart();
    
        const soundBtn = document.getElementById('soundBtn');
        const musicBtn = document.getElementById('musicBtn');
        soundBtn.classList.toggle('active', !this.audio.isSoundMuted);
        musicBtn.classList.toggle('active', !this.audio.isMusicMuted);
    }

    showInitialBriefing() {
        this.gameState = 'briefing';
        this.ui.showInitialBriefing(this.ctx);
    }

    waitForFontAndStart() {
        if (this.fontLoaded) {
            this.startGame();
        } else {
            requestAnimationFrame(this.waitForFontAndStart.bind(this));
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let canvasWidth, canvasHeight;

        if (this.isMobile) {
            canvasWidth = containerWidth;
            canvasHeight = containerHeight;
        } else {
            const maxWidth = 800;
            const maxHeight = window.innerHeight * 0.9;

            if (containerWidth / containerHeight > this.aspectRatio) {
                canvasHeight = Math.min(maxHeight, containerHeight);
                canvasWidth = canvasHeight * this.aspectRatio;
            } else {
                canvasWidth = Math.min(maxWidth, containerWidth);
                canvasHeight = canvasWidth / this.aspectRatio;
            }
        }

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.width = `${canvasWidth}px`;
        this.canvas.style.height = `${canvasHeight}px`;

        this.width = canvasWidth;
        this.height = canvasHeight;
        if (this.player) this.player.setDimensions();
        if (this.ui) this.ui.setFontSize();
    }

    showMainMenu() {
        this.reset();
        this.gameState = 'menu';
        this.ui.showMainMenu(this.ctx);
    }

    startGame() {
        if (this.gameState === 'openingCrawl') {
            this.gameState = 'playing';
            this.level.start();
            this.crawlStartTime = null; // Reset crawlStartTime
        } else {
            this.reset();
            this.gameState = 'playing';
            this.score = 0;
            this.lives = 3;
            this.level.start();
            this.audio.startMusic();
            if (!this.gameLoopStarted) {
                this.gameLoopStarted = true;
                this.gameLoop(0);
            }
        }
    }

    gameLoop(timestamp) {
        if (!this.crawlStartTime && this.gameState === 'openingCrawl') {
            this.crawlStartTime = timestamp;
        }

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update(deltaTime);
        this.render(timestamp - this.crawlStartTime); // Pass elapsedTime to render

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        if (this.gameState === 'openingCrawl') {
            if (this.input.keys.Enter) {
                this.startGame();
            }
            return;
        } else if (this.gameState === 'playing') {
            this.player.update(deltaTime);
            this.updateAsteroids(deltaTime);
            if (this.boss) {
                this.boss.update(deltaTime);
                this.boss.bullets.forEach(bullet => bullet.update());
                this.boss.bullets = this.boss.bullets.filter(bullet => !bullet.markedForDeletion);
                if (this.boss.markedForDeletion) {
                    this.boss = null;
                }
            }
            this.updatePowerUps(deltaTime);
            this.updateMinions(deltaTime);
            this.level.update(deltaTime);
            Collision.handleCollisions(this);
    
            this.powerUpTimer++;
            if (this.powerUpTimer >= this.powerUpSpawnInterval) {
                this.powerUps.push(PowerUp.spawnPowerUp(this));
                this.powerUpTimer = 0;
            }
    
            this.powerUps.forEach(powerUp => {
                if (Collision.checkCollision(this.player, powerUp)) {
                    powerUp.activate();
                    powerUp.markedForDeletion = true;
                }
            });
        } else if (this.gameState === 'menu') {
            // Handle menu navigation
            if (this.input.keys.ArrowUp) {
                this.ui.navigateMenu(-1);
                this.input.keys.ArrowUp = false;
            } else if (this.input.keys.ArrowDown) {
                this.ui.navigateMenu(1);
                this.input.keys.ArrowDown = false;
            } else if (this.input.keys.Enter) {
                this.ui.selectMenuItem();
                this.input.keys.Enter = false;
            }
        } else if (this.gameState === 'briefing' || this.level.state === 'intro' || this.level.state === 'bossDefeated') {
            if (this.input.keys.Enter) {
                this.input.keys.Enter = false; // Reset the key state
                if (this.gameState === 'briefing') {
                    this.startGame();
                } else if (this.level.state === 'intro') {
                    this.level.state = 'asteroids';
                    this.level.transitionTimer = 0;
                } else if (this.level.state === 'bossDefeated') {
                    if (this.level.currentLevel < this.level.planets.length) {
                        this.level.state = 'levelIntro';
                        this.level.transitionTimer = 0;
                        this.level.showLevelIntro();
                    } else {
                        this.gameWon();
                    }
                }
            }
        } else if (this.gameState === 'storyRecap') {
            if (this.input.keys.Enter) {
                this.gameState = 'playing';
                this.showingStoryRecap = false;
            }
        }

        // Allow skipping the opening crawl
        if (this.gameState === 'openingCrawl' && this.input.keys.Enter) {
            this.gameState = 'playing';
            this.level.start();
            this.input.keys.Enter = false;
        }
    }

    render(elapsedTime) { // Updated to accept elapsedTime
        if (this.gameState === 'openingCrawl') {
            this.ui.showOpeningCrawl(this.ctx, elapsedTime); // Pass elapsedTime to UI
            return;
        }
    
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
    
        if (this.assetsLoaded) {
            this.player.render(this.ctx);
            this.asteroids.forEach(asteroid => asteroid.render(this.ctx));
            this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
            this.minions.forEach(minion => minion.render(this.ctx));
            if (this.boss) {
                this.boss.render(this.ctx);
                this.boss.bullets.forEach(bullet => bullet.render(this.ctx));
            }
        }
    
        if (this.gameState === 'briefing') {
            this.ui.showInitialBriefing(this.ctx);
        } else if (this.gameState === 'storyRecap') {
            this.ui.showStoryRecap(this.ctx, this.level.currentLevel);
        }
    
        this.ui.render(this.ctx);
    
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = `${Math.floor(this.ui.fontSize * 1.5)}px ${this.ui.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('MOONSHOT', this.width / 2, 10);
    
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#0ff';
            this.ctx.font = `${this.ui.fontSize * 2}px ${this.ui.fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        }
    
        if (this.level.state === 'bossDefeated') {
            this.ui.showBossDefeatedMessage(this.ctx);
        }
    
        if (this.showGameOverScreen) {
            this.ui.showGameOver(this.ctx);
        }
    
        if (this.debugMode) {
            this.ctx.fillStyle = 'red';
            this.player.bullets.forEach(bullet => {
                this.ctx.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
            });
        }
    
        if (this.menuActive) {
            this.ui.showMenu(this.ctx);
        }
    }

    levelComplete() {
        this.gameState = 'storyRecap';
        this.showingStoryRecap = true;
    }

    gameWon() {
        this.gameState = 'gameWon';
        this.audio.stopMusic();
        this.audio.playSound('victory');
        this.ui.showGameWon(this.ctx);
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
    }

    updateAsteroids(deltaTime) {
        this.asteroids.forEach(asteroid => asteroid.update(deltaTime));
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.markedForDeletion);
    }

    updatePowerUps(deltaTime) {
        this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.markedForDeletion);
    }

    updateMinions(deltaTime) {
        this.minions.forEach(minion => minion.update(deltaTime));
        this.minions = this.minions.filter(minion => !minion.markedForDeletion);
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

    addMinion() {
        this.minions.push(new Minion(this));
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.audio.stopMusic();
        this.audio.playSound('explode');
        this.showGameOverScreen = true;
    }

    // Removed duplicate gameWon method
}

export default Game;
