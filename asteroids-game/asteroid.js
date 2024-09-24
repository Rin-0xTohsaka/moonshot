// asteroid.js

class Asteroid {
    static asteroidImages = [];

    static loadAsteroidImages() {
        const asteroidCount = 5; // Adjust this number based on how many asteroid images you have
        for (let i = 1; i <= asteroidCount; i++) {
            const img = new Image();
            img.src = `assets/asteroids/asteroid_${i}.png`;
            Asteroid.asteroidImages.push(img);
        }
    }

    constructor(game) {
        this.game = game;
        this.setDimensions();
        this.x = Math.random() * (game.width - this.width);
        this.y = -this.height;
        this.setMovementPattern();
        this.selectRandomImage();
        this.markedForDeletion = false;
    }

    setMovementPattern() {
        this.speed = Math.random() * 2 + 0.5; // Speed between 0.5 and 2.5
        this.movementType = Math.random();
        
        if (this.movementType < 0.6) {
            // 60% chance of straight down movement
            this.horizontalSpeed = 0;
        } else if (this.movementType < 0.8) {
            // 20% chance of diagonal movement
            this.horizontalSpeed = (Math.random() - 0.5) * 2; // Between -1 and 1
        } else {
            // 20% chance of sine wave movement
            this.horizontalSpeed = 0;
            this.amplitude = Math.random() * 100 + 50; // Between 50 and 150
            this.frequency = Math.random() * 0.02 + 0.01; // Adjust for desired wave frequency
            this.initialX = this.x;
        }
    }

    selectRandomImage() {
        if (Asteroid.asteroidImages.length === 0) {
            Asteroid.loadAsteroidImages();
        }
        const randomIndex = Math.floor(Math.random() * Asteroid.asteroidImages.length);
        this.image = Asteroid.asteroidImages[randomIndex];
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

        if (this.movementType < 0.8) {
            // Straight down or diagonal movement
            this.x += this.horizontalSpeed;
        } else {
            // Sine wave movement
            this.x = this.initialX + Math.sin(this.y * this.frequency) * this.amplitude;
        }

        // Ensure asteroid stays within game boundaries
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));

        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    hit() {
        this.markedForDeletion = true;
        this.game.score += 10;
        this.game.audio.playSound('explode');
        // Add particle effect here later
    }

    render(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

export default Asteroid;