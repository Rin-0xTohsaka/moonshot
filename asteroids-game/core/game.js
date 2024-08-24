// game.js
// Core game loop and main game object

import { GAME_WIDTH, GAME_HEIGHT, FRAME_PERIOD, LEVEL_TIMEOUT, DEFAULT_LOG_LEVEL } from '../config/gameConfig.js';
import { UP, LEFT, RIGHT, FIRE, THRUST_ACCEL, ROTATE_SPEED, MAX_BULLETS, ASTEROID_CHILDREN, ASTEROID_SCORE, MAX_BULLET_AGE } from '../config/gameConfig.js';
import { ASTEROID_SPEED } from '../config/asteroidConfig.js';
import { createInfoPane } from '../ui/infoPane.js';
import { createPlayer } from './player.js';
import { createKeyState, setupEventListeners } from '../input/eventListeners.js';
import { createAsteroids } from './asteroid.js';
import { createOverlays } from '../ui/overlays.js';
import { createHighScores } from '../ui/highScores.js';
import { createLevel } from './level.js';
import { createLogger } from '../utils/logger.js';
import { collision } from '../utils/collision.js';
import { createLevelManager } from './levelManager.js';
import { createLevelIntro } from './levelIntro.js';
import { createPowerUps } from './powerups.js';
import { createSoundManager } from '../utils/soundManager.js';
import { createPowerUpMenu } from './powerUpMenu.js';
import { createBoss } from './boss.js';

export function createGame(home) {
    console.log('Creating game object');

    const game = {
        log_level: DEFAULT_LOG_LEVEL,
        log: null,
        info: null,
        playfield: null,
        player: null,
        keyState: null,
        asteroids: null,
        overlays: null,
        highScores: null,
        level: null,
        pulse: null,
        levelManager: null,
        powerUps: null,
        sound: null,
        powerUpMenu: null,
        boss: null,
        state: 'playing',
        ctx: null,
        godMode: false, // New property for tracking god mode state
    };

    // Initialize components
    game.log = createLogger(game);
    game.sound = createSoundManager();
    game.sound.startBackgroundMusic();
    game.powerUps = createPowerUps(game);
    game.playfield = createPlayfield(game, home);
    game.ctx = game.playfield.ctx;  // Use the ctx from the playfield object
    game.info = createInfoPane(game, home);
    game.player = createPlayer(game);
    game.keyState = createKeyState();
    setupEventListeners(game);
    game.asteroids = createAsteroids(game);
    game.overlays = createOverlays();
    game.highScores = createHighScores(game);
    game.level = createLevel(game);
    game.levelManager = createLevelManager(game);
    game.levelIntro = createLevelIntro(game);
    game.powerUpMenu = createPowerUpMenu(game);

    console.log('Game object created:', game);

    game.play = function() {
        console.log('Play function called');
        console.log('Canvas context:', game.ctx);
        game.ctx.fillStyle = 'white';
        game.ctx.strokeStyle = 'white';

        let bullets = [];
        let last_fire_state = false;

        game.overlays.add(createStars());

        function startLevel() {
            const currentLevel = game.levelManager.getCurrentLevel();
            game.info.setLevel(currentLevel.name);
            game.levelIntro.showIntro(currentLevel, currentLevel.objective, () => {
                console.log('Level intro complete, setting up level...');
                game.levelManager.setupLevel();
                console.log('Level setup complete, starting game loop...');
                startGameLoop();
            });
        }

        function setupLevelPowerUps(level) {
            // Reset power-ups
            Object.keys(game.powerUps.getPowerUpTypes()).forEach(type => game.powerUps.addPowerUp(type, 0));

            // Define power-ups for each level
            const levelPowerUps = {
                "Pluto": { "shield": 2, "bulletUpgrade": 2 },
                "Neptune": { "extraLife": 1, "freeze": 1 },
                "Uranus": { "shield": 1, "bulletUpgrade": 1 },
                "Saturn": { "extraLife": 1, "freeze": 2 },
                "Jupiter": { "shield": 2, "bulletUpgrade": 1, "freeze": 1 },
                "Mars": { "extraLife": 1, "shield": 1 },
                "Venus": { "bulletUpgrade": 2, "freeze": 1 },
                "Mercury": { "extraLife": 1, "shield": 1, "freeze": 1, "bulletUpgrade": 1 },
                "Earth": { "extraLife": 1, "shield": 2, "freeze": 1, "bulletUpgrade": 2 }
            };

            const powerUpsForLevel = levelPowerUps[level.name];
            Object.keys(powerUpsForLevel).forEach(type => {
                game.powerUps.addPowerUp(type, powerUpsForLevel[type]);
            });
        }

        function toggleGodMode() {
            game.godMode = !game.godMode;
            console.log(`God Mode ${game.godMode ? 'Activated' : 'Deactivated'}`);
            
            if (game.godMode) {
                game.player.setInvincible(true);
            } else {
                game.player.setInvincible(false);
            }
        }

        function handleGodModeControls(event) {
            if (game.godMode) {
                switch(event.key) {
                    case 'n':
                        // Next level
                        game.levelManager.startNextLevel();
                        break;
                    case 'b':
                        // Trigger boss battle
                        game.asteroids.clear();
                        game.levelManager.handleLevelCompletion();
                        break;
                    case 'k':
                        // Kill all asteroids
                        game.asteroids.clear();
                        break;
                    case 'i':
                        // Toggle invincibility
                        game.player.setInvincible(!game.player.isInvincible());
                        console.log(`Invincibility ${game.player.isInvincible() ? 'On' : 'Off'}`);
                        break;
                }
            }
        }

        function startGameLoop() {
            console.log('Game loop starting...');
            game.pulse = setInterval(function() {
                console.log('--- New Frame ---');
                console.log('Game loop running');
        
                if (game.state === 'paused') {
                    game.powerUpMenu.updateAndDraw(); // Draw the menu while paused
                    return; // Skip the rest of the loop
                }

                // Ensure ctx is available before using it
                if (!game.ctx) {
                    console.error('Game context is not available');
                    return;
                }
        
                if (game.player.getLives() <= 0) {
                    clearInterval(game.pulse);
                    game.gameOver(false);
                    return;
                }
        
                console.log('Player state:', {
                    isDead: game.player.isDead(),
                    position: game.player.getPosition(),
                    velocity: game.player.getVelocity(),
                });
        
                console.log('Asteroids:', game.asteroids.length);
                const kill_asteroids = [];
                const new_asteroids = [];
                const kill_bullets = [];
        
                game.ctx.save();
                game.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                console.log('Canvas cleared');
        
                if (!game.player.isDead()) {
                    if (game.keyState.getState(UP)) {
                        game.player.thrust(THRUST_ACCEL);
                        console.log('Player thrusting');
                    }
                    if (game.keyState.getState(LEFT)) {
                        game.player.rotate(-ROTATE_SPEED);
                        console.log('Player rotating left');
                    }
                    if (game.keyState.getState(RIGHT)) {
                        game.player.rotate(ROTATE_SPEED);
                        console.log('Player rotating right');
                    }
        
                    game.player.move();
                    game.player.draw(game.ctx);
                    console.log('Player drawn at:', game.player.getPosition());
                }
        
                const fire_state = game.keyState.getState(FIRE);
                if (fire_state && (fire_state !== last_fire_state) && (bullets.length < MAX_BULLETS)) {
                    const firedBullets = game.player.fire();
                    if (Array.isArray(firedBullets)) {
                        bullets.push(...firedBullets);
                    } else if (firedBullets) {
                        bullets.push(firedBullets);
                    }
                    game.sound.play('laser');  // Play laser sound on fire
                    console.log('Bullet fired:', firedBullets);
                }
                last_fire_state = fire_state;
        
                console.log('Active bullets:', bullets.length);
                for (let i = 0; i < bullets.length; i++) {
                    if (bullets[i].getAge() > MAX_BULLET_AGE) {
                        kill_bullets.push(i);
                    } else {
                        bullets[i].birthday();
                        bullets[i].move();
                        bullets[i].draw(game.ctx);
                        console.log('Bullet position:', bullets[i].getPosition());
                    }
                }
        
                for (let i = kill_bullets.length - 1; i >= 0; i--) {
                    bullets.splice(kill_bullets[i], 1);
                }
        
                const asteroids = game.asteroids.getIterator();
                for (let i = 0; i < asteroids.length; i++) {
                    asteroids[i].move();
                    asteroids[i].draw(game.ctx);
                    console.log('Asteroid position:', asteroids[i].getPosition());
        
                    for (let j = 0; j < bullets.length; j++) {
                        if (collision(bullets[j], asteroids[i])) {
                            game.log.debug('You shot an asteroid!');
                            bullets.splice(j, 1);
                            j--;
                            kill_asteroids.push(i);
                            break;
                        }
                    }
        
                    if (game.player.shieldActive && collision(game.player, asteroids[i])) {
                        const angle = Math.atan2(
                            asteroids[i].getPosition()[1] - game.player.getPosition()[1],
                            asteroids[i].getPosition()[0] - game.player.getPosition()[0]
                        );
        
                        asteroids[i].setVelocity([
                            -asteroids[i].getVelocity()[0] + Math.cos(angle) * 2,
                            -asteroids[i].getVelocity()[1] + Math.sin(angle) * 2
                        ]);
        
                        game.sound.play('hit'); // Play hit sound on deflection
                    } else if (!game.player.isDead() && !game.player.isInvincible() && collision(game.player, asteroids[i])) {
                        game.sound.play('explode');  // Play explosion sound on collision
                        game.player.die();
                        game.info.setLives(game.player.getLives());
                    }
                }
        
                for (let i = kill_asteroids.length - 1; i >= 0; i--) {
                    const asteroidIndex = kill_asteroids[i];
                    const asteroid = asteroids[asteroidIndex];
                    const newAsteroids = game.asteroids.createChildAsteroids(asteroid, ASTEROID_CHILDREN);
                    new_asteroids.push(...newAsteroids);
                    asteroids.splice(asteroidIndex, 1);
                    game.player.addScore(ASTEROID_SCORE);
                    game.info.setScore(game.player.getScore());
                    console.log('Asteroid destroyed, new asteroids created:', newAsteroids.length);
                }
        
                // Handle level completion after all asteroids are destroyed
                console.log("Checking level completion");
                game.levelManager.handleLevelCompletion();
                console.log("Level completion check done");
        
                for (let i = 0; i < new_asteroids.length; i++) {
                    game.asteroids.push(new_asteroids[i]);
                }
        
                // Handle boss and minions collisions and updates
                if (game.boss) {
                    game.boss.update(Date.now());
                    game.boss.draw(game.ctx);
                    
                    // Check bullet collisions with boss
                    for (let i = bullets.length - 1; i >= 0; i--) {
                        console.log('Checking bullet collision with boss');
                        console.log('Bullet:', bullets[i]);
                        console.log('Boss:', game.boss);
                        if (collision(bullets[i], game.boss)) {
                            console.log('Collision detected between bullet and boss');
                            game.boss.takeDamage(1);
                            bullets.splice(i, 1);
                            console.log('Boss hit! Health:', game.boss.getHealth());
                        } else {
                            console.log('No collision detected between bullet and boss');
                        }
                    }

                    // Check collisions with minions
                    game.boss.minions.forEach((minion, index) => {
                        for (let i = bullets.length - 1; i >= 0; i--) {
                            console.log('Checking bullet collision with minion');
                            console.log('Bullet:', bullets[i]);
                            console.log('Minion:', minion);
                            if (collision(bullets[i], minion)) {
                                console.log('Collision detected between bullet and minion');
                                minion.takeDamage(1);
                                bullets.splice(i, 1);
                                console.log('Minion hit! Health:', minion.getHealth());
                                if (minion.getHealth() <= 0) {
                                    game.boss.minions.splice(index, 1);
                                }
                                break;
                            } else {
                                console.log('No collision detected between bullet and minion');
                            }
                        }
                    });

                    if (game.boss.getHealth() <= 0) {
                        game.boss = null;
                        game.levelManager.handleLevelCompletion();
                    }
                }
        
                game.ctx.restore();
        
                console.log('Frame rendered');
                console.log('--- Frame End ---');
            }, FRAME_PERIOD);
        }

        function setupBoss(bossConfig) {
            game.boss = createBoss(game, bossConfig);
        }

        // Event listeners for power-ups and God Mode
        document.addEventListener('keydown', (event) => {
            if (event.key === 'z') {
                if (game.state === 'playing') {
                    game.powerUpMenu.open();
                } else if (game.state === 'paused') {
                    game.powerUpMenu.close();
                }
            }

            // God Mode activation (Ctrl + Alt + G)
            if (event.key === 'g') {
                toggleGodMode();
            }

            // God Mode controls
            handleGodModeControls(event);
        });

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'q':
                    game.powerUps.usePowerUp('extraLife');
                    break;
                case 'w':
                    game.powerUps.usePowerUp('shield');
                    break;
                case 'a':
                    game.powerUps.usePowerUp('freeze');
                    break;
                case 's':
                    game.powerUps.usePowerUp('bulletUpgrade');
                    break;
            }
        });

        startLevel();
    };

    game.gameOver = function(won = false) {
        game.log.debug(won ? 'Congratulations! You won!' : 'Game over!');
        console.log(won ? 'Game won!' : 'Game over called');

        clearInterval(game.pulse);

        if (game.player.getScore() > 0) {
            game.highScores.addScore('Player', game.player.getScore());
        }

        const ctx = game.playfield.getContext('2d');
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = '30px System, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60);

        ctx.font = '20px System, monospace';
        ctx.fillText(`Score: ${game.player.getScore()}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);

        const scores = game.highScores.getScores().slice(0, 10);
        ctx.font = '16px System, monospace';
        ctx.fillText('High Scores:', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
        for (let i = 0; i < scores.length; i++) {
            ctx.fillText(
                `${i + 1}. ${scores[i].name} - ${scores[i].score}`,
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2 + 50 + 20 * i
            );
        }

        // Add a restart button to restart the game
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.style.position = 'absolute';
        restartButton.style.top = `${GAME_HEIGHT / 2 + 100}px`;
        restartButton.style.left = '50%';
        restartButton.style.transform = 'translateX(-50%)';
        restartButton.style.fontSize = '20px';
        restartButton.style.padding = '10px';
        restartButton.style.cursor = 'pointer';
        home.appendChild(restartButton);

        restartButton.addEventListener('click', () => {
            home.removeChild(restartButton); // Remove the button
            game.resetGame(); // Reset the game
        });
    };

    game.resetGame = function() {
        console.log('Resetting game...');
        game.player = createPlayer(game);  // Reset player
        game.asteroids.clear();  // Clear existing asteroids
        game.levelManager.resetLevels();  // Reset to the first level
        game.highScores.clear();  // Clear high scores
        game.sound.startBackgroundMusic();  // Restart background music
        game.play();  // Restart the game loop
    };

    return game;
}

function createPlayfield(game, home) {
    console.log('Creating playfield');
    const canvas = document.createElement('canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    canvas.style.backgroundColor = 'black';
    home.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    return {
        canvas: canvas,
        ctx: ctx,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        getContext: () => ctx  // Add this method for backwards compatibility
    };
}

function createStars() {
    console.log('Creating stars');
    const stars = [];
    for (let i = 0; i < 50; i++) {
        stars.push([Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT]);
    }

    return {
        draw: function(ctx) {
            ctx.fillStyle = 'white';
            for (let i = 0; i < stars.length; i++) {
                ctx.fillRect(stars[i][0], stars[i][1], 1, 1);
            }
        }
    };
}
