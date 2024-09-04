// player.js

import Bullet from './bullet.js';

class Player {
    constructor(game) {
        this.game = game;
        this.setDimensions();
    }

    setDimensions() {
        const scaleFactor = this.game.isMobile ? 0.08 : 0.0625;
        this.width = this.game.width * scaleFactor;
        this.height = this.width;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height - 20;
    }

    reset() {
        this.setDimensions();
        this.speed = 7; // Increased from 5
        this.bullets = [];
        this.cooldown = 0;
        this.cooldownTime = 15; // frames
        this.image = new Image();
        this.image.src = 'assets/ships/pixel_ship.png';
        this.activePowerUps = {
            speedBoost: false,
            shield: false,
            multiShot: false,
            timeFreeze: false
        };
    }

    update(deltaTime) {
        // Movement
        if (this.game.input.keys.ArrowLeft) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (this.game.input.keys.ArrowRight) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }

        // Shooting
        if (this.game.input.keys.Space && this.cooldown === 0) {
            console.log('Attempting to shoot'); // Add this line
            this.shoot();
            this.cooldown = this.cooldownTime;
        }

        if (this.cooldown > 0) {
            this.cooldown--;
        }

        // Apply power-up effects
        if (this.activePowerUps.speedBoost) {
            this.speed = 10; // Increased from 7.5
        } else {
            this.speed = 7; // Normal speed, increased from 5
        }

        if (this.activePowerUps.multiShot && this.game.input.keys.Space && this.cooldown === 0) {
            this.multiShot();
        }

        // Update bullets
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
        console.log(`Player bullets: ${this.bullets.length}`); // Debug log
    }

    render(ctx) {
        ctx.drawImage(
            this.image, 
            Math.round(this.x), 
            Math.round(this.y), 
            this.width, 
            this.height
        );
        this.bullets.forEach(bullet => {
            bullet.render(ctx);
            console.log(`Rendering bullet at (${bullet.x}, ${bullet.y})`); // Debug log
        });
    }

    shoot() {
        console.log('Shoot method called');
        const bullet = new Bullet(this.game, this.x + this.width / 2, this.y - 10);  // Spawn bullet slightly above the player
        this.bullets.push(bullet);
        this.game.audio.playSound('laser');
        console.log(`Bullet created at (${bullet.x}, ${bullet.y})`);
    }

    hit() {
        this.game.lives--;
        this.game.audio.playSound('hit');
        if (this.game.lives <= 0) {
            this.game.gameState = 'gameOver';
            this.game.showGameOverScreen = true;
        }
    }

    multiShot() {
        // Implement multi-shot functionality
        const bulletSpread = 20;
        for (let i = -1; i <= 1; i++) {
            const bullet = new Bullet(this.game, this.x + this.width / 2 + i * bulletSpread, this.y - 10);
            this.bullets.push(bullet);
        }
        this.game.audio.playSound('laser');
        this.cooldown = this.cooldownTime;
    }
}

export default Player;