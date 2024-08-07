// bullet.js
// Bullet object and related methods

import { BULLET_SPEED, BULLET_RADIUS, BULLET_IMAGE_PATH } from '../config/bulletConfig.js';
import { move } from '../utils/movement.js';

let bulletImage = null;

function loadBulletImage() {
    if (!bulletImage) {
        bulletImage = new Image();
        bulletImage.src = BULLET_IMAGE_PATH;
    }
    return bulletImage;
}

export function createBullet(game, _pos, _dir) {
    const bullet = {
        position: [..._pos],
        velocity: [
            BULLET_SPEED * Math.cos(_dir),
            BULLET_SPEED * Math.sin(_dir)
        ],
        direction: _dir,
        age: 0,
        image: loadBulletImage()
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
        ctx.save();
        ctx.translate(bullet.position[0], bullet.position[1]);
        ctx.rotate(bullet.direction + Math.PI / 2); // Adjust rotation as needed

        if (bullet.image.complete) {
            ctx.drawImage(
                bullet.image,
                -BULLET_RADIUS,
                -BULLET_RADIUS,
                BULLET_RADIUS * 2,
                BULLET_RADIUS * 2
            );
        } else {
            // Fallback to drawing a circle if image isn't loaded
            ctx.beginPath();
            ctx.arc(0, 0, BULLET_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
        }

        ctx.restore();
    };

    return bullet;
}