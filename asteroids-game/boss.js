import BossBullet from './bossBullet.js';

// boss.js

class Boss {
    constructor(game, level) {
        this.game = game;
        this.level = level;
        this.setSizeAndPosition();
        this.speed = 1.5; // Increased from 1
        this.health = 100 * level;
        this.maxHealth = this.health;
        this.bullets = [];
        this.shootInterval = 120 - (level * 10); // Shoots faster at higher levels
        this.shootTimer = 0;
        this.image = new Image();
        this.image.src = `assets/alien-bosses/${this.getBossColor()}_boss.png`;
        this.markedForDeletion = false;
    }

    setSizeAndPosition() {
        if (this.game.isMobile) {
            // Smaller size for mobile, scaled based on screen width
            this.width = this.game.width * 0.2; // 20% of screen width
        } else {
            this.width = 100; // Default size for desktop
        }
        this.height = this.width; // Keep it square
        this.x = this.game.width / 2 - this.width / 2;
        this.y = -this.height;
    }

    getBossColor() {
        const colors = ['blue', 'green', 'red', 'yellow'];
        return colors[this.level % colors.length];
    }

    update(deltaTime) {
        // Move down until reaching 1/4 of the screen
        if (this.y < this.game.height / 4) {
            this.y += this.speed;
        }

        // Side-to-side movement (increased amplitude)
        this.x += Math.sin(this.game.lastTime / 800) * 3; // Increased frequency and amplitude

        // Restrict boss movement within screen boundaries
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));

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
        
        // Render bullets
        this.bullets.forEach(bullet => bullet.render(ctx));

        // Health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, (this.health / this.maxHealth) * this.width, 5);
    }

    shoot() {
        const bulletX = this.x + this.width / 2;
        const bulletY = this.y + this.height;
        this.bullets.push(new BossBullet(this.game, bulletX, bulletY));
        // Optionally play a sound effect here
        // this.game.audio.playSound('bosslaser');
    }

    hit(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.markedForDeletion = true;
            this.game.score += 1000 * this.level;
            this.game.audio.playSound('explode');
            this.game.level.bossDefeated();
        }
    }
}

export default Boss;