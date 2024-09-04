// powerup.js

class PowerUp {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 1;
        this.markedForDeletion = false;
        this.type = this.getRandomType();
        this.image = new Image();
        this.image.src = `assets/powerups/${this.type}.png`;
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.onerror = () => {
            console.error(`Failed to load image for power-up: ${this.type}`);
            this.imageLoaded = false;
        };
    }

    getRandomType() {
        const types = ['speedBoost', 'shield', 'multiShot', 'timeFreeze'];
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
                    console.log('Speed boost deactivated');
                }, 5000);
                break;
            case 'shield':
                player.activePowerUps.shield = true;
                setTimeout(() => {
                    player.activePowerUps.shield = false;
                    console.log('Shield deactivated');
                }, 10000);
                break;
            case 'multiShot':
                player.activePowerUps.multiShot = true;
                setTimeout(() => {
                    player.activePowerUps.multiShot = false;
                    console.log('Multi-shot deactivated');
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
                    console.log('Time freeze deactivated');
                }, 5000);
                break;
        }
        console.log(`${this.type} power-up activated`);
    }

    static spawnPowerUp(game) {
        const x = Math.random() * (game.width - 30);
        const y = -30;
        return new PowerUp(game, x, y);
    }
}

export default PowerUp;