// minion.js

class Minion {
    static types = ['blue', 'green', 'red', 'yellow', 'gama', 'prime', 'worker'];

    constructor(game) {
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (game.width - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 1 + 0.5;
        this.health = 20;
        this.shootInterval = 120;
        this.shootTimer = 0;
        this.bullets = [];
        this.type = Minion.types[Math.floor(Math.random() * Minion.types.length)];
        this.image = new Image();
        this.image.src = `assets/enemies/${this.type}_minion.png`;
        this.markedForDeletion = false;
        this.setMovementPattern();
    }

    setMovementPattern() {
        this.movementType = Math.random();
        if (this.movementType < 0.3) {
            // Straight down
            this.moveX = 0;
            this.moveY = this.speed;
        } else if (this.movementType < 0.6) {
            // Diagonal
            this.moveX = (Math.random() - 0.5) * this.speed;
            this.moveY = this.speed;
        } else if (this.movementType < 0.8) {
            // Sine wave
            this.amplitude = Math.random() * 100 + 50;
            this.frequency = Math.random() * 0.02 + 0.01;
            this.initialX = this.x;
        } else {
            // Circular
            this.radius = Math.random() * 50 + 25;
            this.angle = 0;
            this.centerX = this.x;
        }
    }

    update(deltaTime) {
        if (this.movementType < 0.6) {
            // Straight or diagonal movement
            this.x += this.moveX;
            this.y += this.moveY;
        } else if (this.movementType < 0.8) {
            // Sine wave movement
            this.y += this.speed;
            this.x = this.initialX + Math.sin(this.y * this.frequency) * this.amplitude;
        } else {
            // Circular movement
            this.angle += 0.02;
            this.x = this.centerX + Math.cos(this.angle) * this.radius;
            this.y += this.speed * 0.5;
        }

        // Ensure minion stays within game boundaries
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));

        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }

        // Shooting
        this.shootTimer++;
        if (this.shootTimer >= this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Update bullets
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.bullets.forEach(bullet => bullet.render(ctx));
    }

    shoot() {
        const bulletX = this.x + this.width / 2;
        const bulletY = this.y + this.height;
        this.bullets.push(new MinionBullet(this.game, bulletX, bulletY));
    }

    hit(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.markedForDeletion = true;
            this.game.score += 50;
            this.game.audio.playSound('explode');
        }
    }
}

class MinionBullet {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 3;
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Minion;