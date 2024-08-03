// game.js file

import { Ship } from './ship.js';
import { Asteroid } from './asteroids.js';
import { PowerUp } from './powerup.js';
import { distanceBetweenPoints, checkCollision } from './utils.js';
import LevelManager from './levelManager.js';

let canvas, ctx, gameOverEl, scoreEl, powerUpEl, levelEl, objectiveEl;
let gameOver = false;
let score = 0;
let ship, asteroids, powerUps;
let levelManager;

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    gameOverEl = document.getElementById('gameOver');
    scoreEl = document.getElementById('score');
    powerUpEl = document.getElementById('powerUp');
    levelEl = document.getElementById('level');

    if (!canvas || !ctx || !gameOverEl || !scoreEl || !powerUpEl || !levelEl) {
        console.error('Failed to initialize game elements');
        return;
    }

    console.log("Game elements initialized");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    levelManager = new LevelManager();
    ship = new Ship(canvas);
    asteroids = [];
    powerUps = [];

    updateLevelDisplay();
    showObjective();
    setupEventListeners();
    console.log("Game initialized, starting game loop");
    gameLoop();
    console.log("Canvas dimensions:", canvas.width, canvas.height);
}

function startNewLevel() {
    updateLevelDisplay();
    showObjective();
    createAsteroids(5 + levelManager.getCurrentLevel(), canvas.width, canvas.height); // Increase asteroids with level
    ship.respawn();
    powerUps = [];
}

function updateLevelDisplay() {
    levelEl.textContent = `Level: ${levelManager.getCurrentLevel()}`;
}

function showObjective() {
    objectiveEl = document.createElement('div');
    objectiveEl.id = 'objective';
    objectiveEl.style.position = 'absolute';
    objectiveEl.style.top = '50%';
    objectiveEl.style.left = '50%';
    objectiveEl.style.transform = 'translate(-50%, -50%)';
    objectiveEl.style.fontSize = '24px';
    objectiveEl.style.color = 'white';
    objectiveEl.style.fontFamily = 'monospace';
    objectiveEl.style.textAlign = 'center';
    objectiveEl.innerHTML = `Objective:<br>${levelManager.getCurrentObjective()}<br><br>
                            <button id="startLevelButton">Start Level</button>`;

    document.body.appendChild(objectiveEl);

    document.getElementById('startLevelButton').addEventListener('click', () => {
        objectiveEl.remove();
        startNewLevel();
    });
}

function createAsteroids(count, canvasWidth, canvasHeight) {
    console.log("Creating", count, "asteroids");
    asteroids = []; // Clear existing asteroids
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const radius = Math.random() * 30 + 20;
        asteroids.push(new Asteroid(x, y, radius, canvasWidth, canvasHeight));
    }
}

function spawnPowerUp() {
    if (Math.random() < 0.005 && powerUps.length < 3) {
        powerUps.push(new PowerUp(canvas));
    }
}

function activatePowerUp(type) {
    ship.activePowerUp = type;
    const duration = 10000;  // 10 seconds

    switch(type) {
        case 'shield':
            ship.shield = true;
            setTimeout(() => { ship.shield = false; ship.activePowerUp = null; }, duration);
            break;
        case 'rapidFire':
            ship.rapidFire = true;
            setTimeout(() => { ship.rapidFire = false; ship.activePowerUp = null; }, duration);
            break;
        case 'extraLife':
            ship.lives++;
            ship.activePowerUp = null;
            updateScoreEl();
            break;
        case 'bulletRange':
            ship.bulletRange = 2;
            setTimeout(() => { ship.bulletRange = 1; ship.activePowerUp = null; }, duration);
            break;
        case 'spreadShot':
            ship.spreadShot = true;
            setTimeout(() => { ship.spreadShot = false; ship.activePowerUp = null; }, duration);
            break;
    }
    powerUpEl.textContent = `Active: ${type}`;
    setTimeout(() => powerUpEl.textContent = '', duration);
}

function updateGameState() {
    if (gameOver) return;
    spawnPowerUp();
    ship.update();
    updateAsteroids();
    updatePowerUps();
}

function renderGameElements() {
    if (gameOver) return;
    ship.draw(ctx);
    console.log("Ship position:", ship.x, ship.y);
    ship.bullets.forEach(bullet => bullet.draw(ctx));
    asteroids.forEach(asteroid => asteroid.draw(ctx));
    powerUps.forEach(powerUp => powerUp.draw(ctx));
}

function updateAsteroids() {
    asteroids = asteroids.filter(asteroid => {
        asteroid.update();

        if (checkCollision(ship, asteroid) && !ship.shield) {
            ship.lives--;
            updateScoreEl();

            if (ship.lives <= 0) {
                gameOver = true;
                showGameOver();
                return false;
            } else {
                ship.respawn();
            }
            return false;
        }

        for (let bullet of ship.bullets) {
            if (checkCollision(bullet, asteroid)) {
                score += Math.floor(100 / asteroid.radius);
                updateScoreEl();
                bullet.lifespan = 0;

                if (asteroid.radius > 20) {
                    const newRadius = asteroid.radius / 2;
                    asteroids.push(new Asteroid(asteroid.x, asteroid.y, newRadius, canvas.width, canvas.height));
                    asteroids.push(new Asteroid(asteroid.x, asteroid.y, newRadius, canvas.width, canvas.height));
                }

                return false;
            }
        }

        return true;
    });
}

function updatePowerUps() {
    powerUps = powerUps.filter(powerUp => {
        if (checkCollision(ship, powerUp)) {
            activatePowerUp(powerUp.type);
            return false;
        }
        return true;
    });
}

function isLevelComplete() {
    return asteroids.length === 0;
}

function gameLoop() {
    if (gameOver) {
        console.log("Game loop halted due to game over.");
        return;
    }

    try {
        console.log("Game loop running, gameOver:", gameOver, "Ship lives:", ship.lives, "Asteroids:", asteroids.length);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isLevelComplete()) {
            if (levelManager.nextLevel()) {
                showObjective();
            } else {
                gameOver = true;
                showGameOver(true);
                return;
            }
        }

        updateGameState();
        renderGameElements();

        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error("Error in game loop:", error);
        gameOver = true;
        showGameOver();
    }
}

function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        console.log("Key pressed:", e.key);
        if (gameOver) return;
        if (e.key === 'ArrowLeft') ship.rotation = 0.1;
        if (e.key === 'ArrowRight') ship.rotation = -0.1;
        if (e.key === 'ArrowUp') ship.thrusting = true;
        if (e.key === ' ') ship.shoot();
    });

    document.addEventListener('keyup', (e) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ship.rotation = 0;
        if (e.key === 'ArrowUp') ship.thrusting = false;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ship.updateCanvasBounds(canvas);
    });
}

function updateScoreEl() {
    if (scoreEl) {
        scoreEl.textContent = `Score: ${score} | Lives: ${ship.lives}`;
    } else {
        console.error('Score element not found');
    }
}

function showGameOver(completed = false) {
    gameOverEl.style.display = 'block';
    gameOverEl.innerHTML = completed 
        ? 'Congratulations! You completed the game!' 
        : 'Game Over<br><button id="restartButton">Restart</button>';

    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            console.log("Restart button clicked");
            window.restartGame();
        });
    }
}

function restartGame() {
    console.log("Restarting game...");
    gameOver = false;
    score = 0;
    ship.lives = 3;
    updateScoreEl();
    levelManager = new LevelManager();
    ship = new Ship(canvas);
    asteroids = [];
    powerUps = [];
    startNewLevel();
    gameOverEl.style.display = 'none';
    console.log("Game restarted, starting game loop...");
    gameLoop();
}

// Attach the restartGame function to the window object to make it globally accessible
window.restartGame = restartGame;

document.addEventListener('DOMContentLoaded', init);
