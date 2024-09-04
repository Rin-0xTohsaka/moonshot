// asteroid.js

class Asteroid {
    constructor(game) {
        this.game = game;
        this.setDimensions();
        this.x = Math.random() * (game.width - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 3 + 2; // Increased from Math.random() * 2 + 1
        this.image = new Image();
        this.image.src = 'assets/planets/jupiter.png'; // Placeholder, we'll need to create asteroid sprites
        this.markedForDeletion = false;
    }

    setDimensions() {
        if (this.game.isMobile) {
            this.width = this.game.width * 0.08;
            this.height = this.game.width * 0.08;
        } else {
            this.width = 50;
            this.height = 50;
        }
    }

    update(deltaTime) {
        this.y += this.speed;
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    hit() {
        this.markedForDeletion = true;
        this.game.score += 10;
        this.game.audio.playSound('explode');
        // Add particle effect here later
    }
}

export default Asteroid;