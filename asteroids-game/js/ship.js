// ship.js

import { Bullet } from './bullet.js';

export class Ship {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 15;
        this.angle = 0;
        this.rotation = 0;
        this.thrusting = false;
        this.thrust = { x: 0, y: 0 };
        this.bullets = [];
        this.shield = false;
        this.rapidFire = false;
        this.bulletRange = 1;
        this.spreadShot = false;
        this.lives = 3;
        this.activePowerUp = null;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.radius, 0);
        ctx.lineTo(-this.radius, -this.radius / 2);
        ctx.lineTo(-this.radius, this.radius / 2);
        ctx.closePath();
        ctx.stroke();

        if (this.shield) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();

        if (this.thrusting) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.angle);
            ctx.strokeStyle = 'orange';
            ctx.beginPath();
            ctx.moveTo(-this.radius, 0);
            ctx.lineTo(-this.radius - 10, 0);
            ctx.stroke();
            ctx.restore();
        }
    }

    update() {
        this.angle += this.rotation;

        if (this.thrusting) {
            this.thrust.x += 0.1 * Math.cos(this.angle);
            this.thrust.y -= 0.1 * Math.sin(this.angle);
        } else {
            this.thrust.x *= 0.99;
            this.thrust.y *= 0.99;
        }

        this.x += this.thrust.x;
        this.y += this.thrust.y;

        this.wrapAround();

        this.bullets = this.bullets.filter(bullet => bullet.isActive());
        this.bullets.forEach(bullet => bullet.update(this.canvas));
    }

    wrapAround() {
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    shoot() {
        const bulletSpeed = 5;
        if (this.rapidFire || this.bullets.length === 0) {
            if (this.spreadShot) {
                for (let i = -1; i <= 1; i++) {
                    const angle = this.angle + i * 0.2;
                    const bulletX = this.x + this.radius * Math.cos(angle);
                    const bulletY = this.y - this.radius * Math.sin(angle);
                    this.bullets.push(new Bullet(bulletX, bulletY, angle, bulletSpeed, this.bulletRange, this.activePowerUp));
                }
            } else {
                const bulletX = this.x + this.radius * Math.cos(this.angle);
                const bulletY = this.y - this.radius * Math.sin(this.angle);
                this.bullets.push(new Bullet(bulletX, bulletY, this.angle, bulletSpeed, this.bulletRange, this.activePowerUp));
            }
        }
    }

    respawn() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.thrust = { x: 0, y: 0 };
        this.angle = 0;
        this.rotation = 0;
        this.thrusting = false;
        this.shield = true; // Give temporary invincibility on respawn
        setTimeout(() => { this.shield = false; }, 2000); // Remove shield after 2 seconds
    }
    

    updateCanvasBounds(canvas) {
        this.canvas = canvas;
    }
}