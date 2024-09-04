// bullet.js

class Bullet {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 8;  // Increase width
        this.height = 20;  // Increase height
        this.speed = 7;  // Increased from 5
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'assets/projectiles/pixel_laser_blue.png';
    }

    update(deltaTime) {
        this.y -= this.speed;
        console.log(`Bullet updated: (${this.x}, ${this.y})`);
        if (this.y + this.height < 0) {
            this.markedForDeletion = true;
            console.log('Bullet marked for deletion');
        }
    }

    render(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            // Fallback rendering if image hasn't loaded
            ctx.fillStyle = 'yellow';  // Change color to yellow for better visibility
            ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        }
        console.log(`Bullet rendered at (${this.x}, ${this.y})`);
    }
}

export default Bullet;