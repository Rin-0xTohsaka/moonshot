// bossBullet.js

class BossBullet {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 8;  // Adjust if needed to match the image size
        this.height = 20;  // Adjust if needed to match the image size
        this.speed = 3;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'assets/projectiles/pixel_laser_red.png';
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
        } else {
            // Fallback rendering if image hasn't loaded
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        }
    }
}

export default BossBullet;