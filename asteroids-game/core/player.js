// player.js
// Player object and related methods

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import {
    ROTATE_SPEED,
    MAX_SPEED,
    THRUST_ACCEL,
    DEATH_TIMEOUT,
    INVINCIBLE_TIMEOUT,
    PLAYER_LIVES,
    POINTS_PER_SHOT,
    PLAYER_RADIUS,
    PLAYER_IMAGE_PATH
} from '../config/playerConfig.js';
import { move } from '../utils/movement.js';
import { createBullet } from './bullet.js';

export function createPlayer(game) {
    const player = {
        position: [GAME_WIDTH / 2, GAME_HEIGHT / 2],
        velocity: [0, 0],
        direction: -Math.PI / 2,
        dead: false,
        invincible: false,
        lastRez: null,
        lives: PLAYER_LIVES,
        score: 0,
        image: new Image(),
        shieldActive: false,
        bulletUpgradeActive: false,
        bulletUpgradeUses: 4, // Maximum uses for bullet upgrade
    };

    player.image.src = PLAYER_IMAGE_PATH;
    player.image.onload = () => {
        game.log.debug('Player image loaded');
    };

    player.getPosition = () => player.position;
    player.getVelocity = () => player.velocity;
    player.getSpeed = () => Math.sqrt(Math.pow(player.velocity[0], 2) + Math.pow(player.velocity[1], 2));
    player.getDirection = () => player.direction;
    player.getRadius = () => PLAYER_RADIUS;
    player.getScore = () => player.score;
    player.getLives = () => player.lives;

    player.addScore = (pts) => {
        player.score += pts;
    };

    player.lowerScore = (pts) => {
        player.score = Math.max(0, player.score - pts);
    };

    player.rotate = (rad) => {
        if (!player.dead) {
            player.direction += rad;
            game.log.info(player.direction);
        }
    };

    player.thrust = (force) => {
        if (!player.dead) {
            player.velocity[0] += force * Math.cos(player.direction);
            player.velocity[1] += force * Math.sin(player.direction);

            if (player.getSpeed() > MAX_SPEED) {
                player.velocity[0] = MAX_SPEED * Math.cos(player.direction);
                player.velocity[1] = MAX_SPEED * Math.sin(player.direction);
            }

            game.log.info(player.velocity);
        }
    };

    player.move = () => {
        move(player.position, player.velocity);
    };

    player.draw = (ctx) => {
        console.log('Drawing player', {
            position: player.position,
            direction: player.direction,
            imageLoaded: player.image.complete
        });

        ctx.save();
        ctx.translate(player.position[0], player.position[1]);
        ctx.rotate(player.direction + Math.PI / 2); // Adjust rotation as needed

        if (player.image.complete) {
            ctx.drawImage(
                player.image, 
                -PLAYER_RADIUS, 
                -PLAYER_RADIUS, 
                PLAYER_RADIUS * 2, 
                PLAYER_RADIUS * 2
            );
        } else {
            // Fallback to drawing a triangle if image isn't loaded
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-5, 5);
            ctx.lineTo(-5, -5);
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();
            console.log('Fallback triangle drawn');
        }

        if (player.invincible) {
            const dt = ((new Date()) - player.lastRez) / 200;
            const alpha = Math.cos(dt) * 0.5 + 0.5;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, PLAYER_RADIUS + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Draw shield if active
        if (player.shieldActive) {
            ctx.beginPath();
            ctx.arc(0, 0, PLAYER_RADIUS + 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.restore();
        console.log('Player draw complete');
    };

    player.isDead = () => player.dead;
    player.isInvincible = () => player.invincible;

    player.addLife = () => {
        game.log.debug('Woo, extra life!');
        player.lives++;
    };

    player.activateShield = () => {
        if (!player.shieldActive) {
            player.shieldActive = true;
            console.log('Shield activated!');
            setTimeout(() => {
                player.shieldActive = false;
                console.log('Shield deactivated!');
            }, 10000); // Shield lasts for 10 seconds
        }
    };

    player.upgradeBullets = () => {
        if (player.bulletUpgradeUses > 0 && !player.bulletUpgradeActive) {
            player.bulletUpgradeActive = true;
            player.bulletUpgradeUses--;
            console.log('Bullet upgrade activated!');
            setTimeout(() => {
                player.bulletUpgradeActive = false;
                console.log('Bullet upgrade deactivated!');
            }, 15000); // Bullet upgrade lasts for 15 seconds
        }
    };

    player.die = () => {
        if (!player.dead) {
            game.log.info('You died!');
            player.dead = true;
            player.invincible = true;
            player.lives--;
            player.position = [GAME_WIDTH / 2, GAME_HEIGHT / 2];
            player.velocity = [0, 0];
            player.direction = -Math.PI / 2;
            if (player.lives > 0) {
                setTimeout(() => player.resurrect(), DEATH_TIMEOUT);
            } else {
                game.gameOver();
            }
        }
    };

    player.resurrect = () => {
        if (player.dead) {
            player.dead = false;
            player.invincible = true;
            player.lastRez = new Date();
            setTimeout(() => {
                player.invincible = false;
                game.log.debug('No longer invincible!');
            }, INVINCIBLE_TIMEOUT);
            game.log.debug('You resurrected!');
        }
    };

    player.fire = () => {
        if (!player.dead) {
            game.log.debug('You fired!');
            const _pos = [...player.position];
            const _dir = player.direction;

            player.lowerScore(POINTS_PER_SHOT);

            if (player.bulletUpgradeActive) {
                // Bullet ripple effect
                const bullets = [];
                const numBullets = 12; // Number of bullets in ripple
                for (let i = 0; i < numBullets; i++) {
                    const angle = (i * 2 * Math.PI) / numBullets;
                    bullets.push(createBullet(game, _pos, angle));
                }
                return bullets;
            } else {
                return createBullet(game, _pos, _dir);
            }
        }
    };

    player.setInvincible = (value) => {
        player.invincible = value;
    };

    return player;
}
