// player.js

import Bullet from './bullet.js';

class Player {
    constructor(game) {
        this.game = game;
        this.setDimensions();
        this.bullets = []; // Initialize bullets array in constructor
        this.activePowerUps = {
            speedBoost: false,
            shield: false,
            multiShot: false,
            timeFreeze: false,
        };
        this.duplicateShip = null;
        this.laserShotsActive = false;
        this.reset(); // Call reset to initialize other properties
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
        this.speed = 7;
        this.bullets = []; // Reset bullets array
        this.cooldown = 0;
        this.cooldownTime = 15;
        this.image = new Image();
        this.image.src = 'assets/ships/pixel_ship.png';
        this.duplicateShip = null;
        this.laserShotsActive = false;
        this.activePowerUps = {
            speedBoost: false,
            shield: false,
            multiShot: false,
            timeFreeze: false,
            duplicate: false,
            laserShots: false
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
            this.shoot();
            this.cooldown = this.cooldownTime;
        }

        if (this.cooldown > 0) {
            this.cooldown--;
        }

        // Apply power-up effects
        if (this.activePowerUps.speedBoost) {
            this.speed = 10;
        } else {
            this.speed = 7;
        }

        if (this.activePowerUps.multiShot && this.game.input.keys.Space && this.cooldown === 0) {
            this.multiShot();
        }

        // Update bullets
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);

        if (this.duplicateShip) {
            this.duplicateShip.x = this.x + this.width + 10;
            this.duplicateShip.y = this.y;
        }
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
        });
        if (this.duplicateShip) {
            ctx.drawImage(
                this.image,
                Math.round(this.duplicateShip.x),
                Math.round(this.duplicateShip.y),
                this.width,
                this.height
            );
        }
    }

    shoot() {
        if (this.laserShotsActive) {
            this.shootLaserShots();
        } else {
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y - 10;
            const bullet = new Bullet(this.game, bulletX, bulletY);
            this.bullets.push(bullet);
            this.game.audio.playSound('laser');
        }
        if (this.duplicateShip) {
            const bulletX = this.duplicateShip.x + this.width / 2;
            const bulletY = this.duplicateShip.y - 10;
            const bullet = new Bullet(this.game, bulletX, bulletY);
            this.bullets.push(bullet);
        }
    }

    shootLaserShots() {
        const bulletCount = 10;
        const spreadAngle = Math.PI / 4; // 45 degrees spread

        for (let i = 0; i < bulletCount; i++) {
            const angle = (i / (bulletCount - 1) - 0.5) * spreadAngle;
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y - 10;
            const bullet = new Bullet(this.game, bulletX, bulletY, angle);
            this.bullets.push(bullet);
        }

        this.game.audio.playSound('laser');
    }

    activateDuplicate() {
        this.duplicateShip = { x: this.x + this.width + 10, y: this.y };
        this.activePowerUps.duplicate = true;
        setTimeout(() => {
            this.duplicateShip = null;
            this.activePowerUps.duplicate = false;
        }, 10000); // 10 seconds duration
    }

    activateLaserShots() {
        this.laserShotsActive = true;
        this.activePowerUps.laserShots = true;
        setTimeout(() => {
            this.laserShotsActive = false;
            this.activePowerUps.laserShots = false;
        }, 8000); // 8 seconds duration
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
