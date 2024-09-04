// bossBullet.js

class BossBullet {
    static image = null;

    static preloadImage() {
        if (!BossBullet.image) {
            BossBullet.image = new Image();
            BossBullet.image.src = 'assets/projectiles/pixel_laser_red.png';
            return new Promise((resolve, reject) => {
                BossBullet.image.onload = resolve;
                BossBullet.image.onerror = reject;
            });
        }
        return Promise.resolve();
    }

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.setDimensions();
        this.speed = this.game.isMobile ? 2 : 3; // Slightly slower on mobile
        this.markedForDeletion = false;
    }

    setDimensions() {
        if (this.game.isMobile) {
            this.width = this.game.width * 0.03;
            this.height = this.game.width * 0.06;
        } else {
            this.width = 8;
            this.height = 20;
        }
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        if (BossBullet.image && BossBullet.image.complete) {
            ctx.drawImage(BossBullet.image, this.x - this.width / 2, this.y, this.width, this.height);
        }
        // Remove the fallback rendering
    }
}

export default BossBullet;