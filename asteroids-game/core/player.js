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
    PLAYER_PATH,
    PLAYER_RADIUS
} from '../config/playerConfig.js';
import { move } from '../utils/movement.js';
import { drawPath } from '../utils/drawing.js';
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
            path: PLAYER_PATH
        });
        let color = '#fff';
        if (player.invincible) {
            const dt = ((new Date()) - player.lastRez) / 200;
            const c = Math.floor(Math.cos(dt) * 16).toString(16);
            color = `#${c}${c}${c}`;
        }
        drawPath(ctx, player.position, player.direction, 1, PLAYER_PATH, color);
        console.log('Player draw complete');
    };

    player.isDead = () => player.dead;
    player.isInvincible = () => player.invincible;

    player.extraLife = () => {
        game.log.debug('Woo, extra life!');
        player.lives++;
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

            return createBullet(game, _pos, _dir);
        }
    };

    return player;
}