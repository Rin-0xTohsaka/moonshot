class Minion {
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
        this.image = new Image();
        this.image.src = 'assets/enemies/minion.png'; // Make sure to add this asset
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.y += this.speed;
        this.x += Math.sin(this.game.lastTime / 1000) * 2; // Slight side-to-side movement
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