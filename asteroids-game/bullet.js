// bullet.js

class Bullet {
    static image = null;

    static preloadImage() {
        if (!Bullet.image) {
            Bullet.image = new Image();
            Bullet.image.src = 'assets/projectiles/pixel_laser_blue.png';
            return new Promise((resolve, reject) => {
                Bullet.image.onload = resolve;
                Bullet.image.onerror = reject;
            });
        }
        return Promise.resolve();
    }

    constructor(game, x, y, angle = 0) {
        this.game = game;
        this.x = x;
        this.y = y;
        // Adjust size for mobile
        this.width = this.game.isMobile ? 12 : 8;
        this.height = this.game.isMobile ? 30 : 20;
        // Slightly reduce speed for mobile
        this.speed = this.game.isMobile ? 6 : 7;
        this.markedForDeletion = false;
        this.angle = angle;
    }

    update(deltaTime) {
        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
        if (this.y + this.height < 0 || this.x < 0 || this.x > this.game.width) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        if (Bullet.image && Bullet.image.complete) {
            ctx.drawImage(Bullet.image, this.x - this.width / 2, this.y, this.width, this.height);
        }
        // Remove the fallback rendering
    }
}

export default Bullet;