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
    };


    game.log = createLogger(game);
    game.playfield = createPlayfield(game, home);
    game.info = createInfoPane(game, home);
    game.player = createPlayer(game);
    game.keyState = createKeyState();
    setupEventListeners(game);
    game.asteroids = createAsteroids(game);
    game.overlays = createOverlays();
    game.highScores = createHighScores(game);
    game.level = createLevel(game);


    console.log('Game object created:', game);

    game.play = function() {
        console.log('Play function called');
        const ctx = game.playfield.getContext('2d');
        console.log('Canvas context:', ctx);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
    
        const speed = ASTEROID_SPEED;
        const hspeed = ASTEROID_SPEED / 2;
    
        game.level.levelUp();
    
        let bullets = [];
        let last_fire_state = false;
        let last_asteroid_count = 0;
        let extra_lives = 0;
    
        game.overlays.add(createStars());
    
        game.pulse = setInterval(function() {
            console.log('Game loop running');
        
            console.log('Player state:', {
                isDead: game.player.isDead(),
                position: game.player.getPosition(),
                velocity: game.player.getVelocity()
            });
            
            console.log('Asteroids:', game.asteroids.length);
            const kill_asteroids = [];
            const new_asteroids = [];
            const kill_bullets = [];
    
            ctx.save();
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
            // Player movement and drawing
            if (!game.player.isDead()) {
                // Handle player movement based on key state
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
                game.player.draw(ctx);
                console.log('Player position:', game.player.getPosition());
            }
    
            // Bullet handling
            const fire_state = game.keyState.getState(FIRE);
            if (fire_state && (fire_state != last_fire_state) && (bullets.length < MAX_BULLETS)) {
                const b = game.player.fire();
                if (b) {
                    bullets.push(b);
                    console.log('Bullet fired:', b.getPosition());
                }
            }
            last_fire_state = fire_state;
    
            // Move and draw bullets
            console.log('Active bullets:', bullets.length);
            for (let i = 0; i < bullets.length; i++) {
                if (bullets[i].getAge() > MAX_BULLET_AGE) {
                    kill_bullets.push(i);
                } else {
                    bullets[i].birthday();
                    bullets[i].move();
                    bullets[i].draw(ctx);
                    console.log('Bullet position:', bullets[i].getPosition());
                }
            }
    
            // Remove old bullets
            for (let i = kill_bullets.length - 1; i >= 0; i--) {
                bullets.splice(kill_bullets[i], 1);
            }
    
            // Asteroid handling
            const asteroids = game.asteroids.getIterator();
            for (let i = 0; i < asteroids.length; i++) {
                asteroids[i].move();
                asteroids[i].draw(ctx);
                console.log('Asteroid position:', asteroids[i].getPosition());
    
                // Check for collisions with bullets
                for (let j = 0; j < bullets.length; j++) {
                    if (collision(bullets[j], asteroids[i])) {
                        game.log.debug('You shot an asteroid!');
                        console.log('Collision: bullet and asteroid');
                        bullets.splice(j, 1);
                        j--;
                        kill_asteroids.push(i);
                        break;
                    }
                }
    
                // Check for collision with player
                if (!game.player.isDead() && !game.player.isInvincible() && collision(game.player, asteroids[i])) {
                    game.player.die();
                    console.log('Collision: player and asteroid');
                }
            }
    
            // Remove destroyed asteroids and create new ones
            for (let i = kill_asteroids.length - 1; i >= 0; i--) {
                const asteroidIndex = kill_asteroids[i];
                const asteroid = asteroids[asteroidIndex];
                const newAsteroids = game.asteroids.createChildAsteroids(asteroid, ASTEROID_CHILDREN);
                new_asteroids.push(...newAsteroids);
                asteroids.splice(asteroidIndex, 1);
                game.player.addScore(ASTEROID_SCORE);
                console.log('Asteroid destroyed, new asteroids created:', newAsteroids.length);
            }
    
            // Add new asteroids
            for (let i = 0; i < new_asteroids.length; i++) {
                game.asteroids.push(new_asteroids[i]);
            }

            console.log('End of game loop. Asteroid count:', game.asteroids.length);

    
            ctx.restore();
    
            // Level up logic
            if (game.asteroids.length === 0 && last_asteroid_count !== 0) {
                setTimeout(() => {
                    game.level.levelUp();
                    console.log('Level up!');
                }, LEVEL_TIMEOUT);
            }
    
            last_asteroid_count = game.asteroids.length;
    
            // Draw overlays
            game.overlays.draw(ctx);
    
            // Update the info pane
            game.info.setLives(game.player.getLives());
            game.info.setScore(game.player.getScore());
            game.info.setLevel(game.level.getLevel());
            console.log('Frame rendered');
        }, FRAME_PERIOD);
    };

    game.gameOver = function() {
        game.log.debug('Game over!');
        console.log('Game over called');

        if (game.player.getScore() > 0) {
            game.highScores.addScore('Player', game.player.getScore());
            console.log('High score added:', game.player.getScore());
        }

        game.overlays.add({
            draw: function(ctx) {
                ctx.font = '30px System, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2);

                const scores = game.highScores.getScores();
                ctx.font = '12px System, monospace';
                for (let i = 0; i < scores.length; i++) {
                    ctx.fillText(
                        `${scores[i].name}   ${scores[i].score}`,
                        GAME_WIDTH / 2,
                        GAME_HEIGHT / 2 + 20 + 14 * i
                    );
                }
                console.log('Game over screen drawn');
            },
        });
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
    console.log('Playfield created:', canvas);
    console.log('Canvas dimensions:', canvas.width, canvas.height);

    // Test drawing
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 50, 50);
    console.log('Test rectangle drawn');

    return canvas;
}

function createStars() {
    console.log('Creating stars');
    const stars = [];
    for (let i = 0; i < 50; i++) {
        stars.push([Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT]);
    }

    return {
        draw: function(ctx) {
            for (let i = 0; i < stars.length; i++) {
                ctx.fillRect(stars[i][0], stars[i][1], 1, 1);
            }
            console.log('Stars drawn');
        }
    };
}