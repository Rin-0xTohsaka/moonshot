// powerup.js

class PowerUp {
    static preloadImages() {
        const types = ['speedBoost', 'shield', 'multiShot', 'timeFreeze', 'life']; // Add 'life' to the types array
        return Promise.all(types.map(type => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject(`Failed to load power-up image: ${type}`);
                img.src = `assets/powerups/${type}.png`;
            });
        }));
    }

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 1;
        this.markedForDeletion = false;
        this.type = this.getRandomType();
        this.image = game.loadedImages[this.type];
        this.imageLoaded = true;
    }

    getRandomType() {
        const types = ['speedBoost', 'shield', 'multiShot', 'timeFreeze', 'life']; // Add 'life' to the types array
        return types[Math.floor(Math.random() * types.length)];
    }

    update() {
        this.y += this.speed;
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback rendering if image hasn't loaded
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(this.type, this.x, this.y + this.height / 2);
        }
    }

    activate() {
        const player = this.game.player;
        switch (this.type) {
            case 'speedBoost':
                player.activePowerUps.speedBoost = true;
                setTimeout(() => {
                    player.activePowerUps.speedBoost = false;
                }, 5000);
                break;
            case 'shield':
                player.activePowerUps.shield = true;
                setTimeout(() => {
                    player.activePowerUps.shield = false;
                }, 10000);
                break;
            case 'multiShot':
                player.activePowerUps.multiShot = true;
                setTimeout(() => {
                    player.activePowerUps.multiShot = false;
                }, 8000);
                break;
            case 'timeFreeze':
                player.activePowerUps.timeFreeze = true;
                this.game.asteroids.forEach(asteroid => asteroid.speed *= 0.5);
                if (this.game.boss) this.game.boss.speed *= 0.5;
                setTimeout(() => {
                    player.activePowerUps.timeFreeze = false;
                    this.game.asteroids.forEach(asteroid => asteroid.speed *= 2);
                    if (this.game.boss) this.game.boss.speed *= 2;
                }, 5000);
                break;
            case 'life':
                if (this.game.lives < 5) { // Limit maximum lives to 5
                    this.game.lives++;
                }
                break;
        }
    }

    static spawnPowerUp(game) {
        const x = Math.random() * (game.width - 30);
        const y = -30;
        return new PowerUp(game, x, y);
    }
}

export default PowerUp;