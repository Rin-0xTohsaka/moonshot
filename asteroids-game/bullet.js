// bullet.js

class Bullet {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        // Increase size for mobile
        this.width = this.game.isMobile ? 16 : 8;
        this.height = this.game.isMobile ? 40 : 20;
        // Slightly reduce speed for mobile
        this.speed = this.game.isMobile ? 5 : 7;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'assets/projectiles/pixel_laser_blue.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    update(deltaTime) {
        this.y -= this.speed;
        if (this.y + this.height < 0) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            // Fallback rendering if image hasn't loaded
            ctx.fillStyle = '#00f'; // Bright blue color
            ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        }
    }
}

export default Bullet;