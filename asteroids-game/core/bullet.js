// bullet.js
// Bullet object and related methods

import { BULLET_SPEED, BULLET_PATH, BULLET_RADIUS } from '../config/bulletConfig.js';
import { move } from '../utils/movement.js';
import { drawPath } from '../utils/drawing.js';

export function createBullet(game, _pos, _dir) {
    const bullet = {
        position: [..._pos],
        velocity: [
            BULLET_SPEED * Math.cos(_dir),
            BULLET_SPEED * Math.sin(_dir)
        ],
        direction: _dir,
        age: 0
    };

    bullet.getPosition = () => bullet.position;
    bullet.getVelocity = () => bullet.velocity;
    bullet.getSpeed = () => Math.sqrt(Math.pow(bullet.velocity[0], 2) + Math.pow(bullet.velocity[1], 2));
    bullet.getRadius = () => BULLET_RADIUS;
    bullet.getAge = () => bullet.age;

    bullet.birthday = () => {
        bullet.age++;
    };

    bullet.move = () => {
        move(bullet.position, bullet.velocity);
    };

    bullet.draw = (ctx) => {
        drawPath(ctx, bullet.position, bullet.direction, 1, BULLET_PATH);
    };

    return bullet;
}