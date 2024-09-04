// collision.js

class Collision {
    static checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    static handleCollisions(game) {
        const { player, asteroids, boss } = game;

        // Player bullets with asteroids
        player.bullets.forEach(bullet => {
            asteroids.forEach(asteroid => {
                if (this.checkCollision(bullet, asteroid)) {
                    bullet.markedForDeletion = true;
                    asteroid.hit();
                }
            });
        });

        // Player with asteroids
        if (!player.activePowerUps.shield) {
            asteroids.forEach(asteroid => {
                if (this.checkCollision(player, asteroid)) {
                    player.hit();
                    asteroid.hit();
                }
            });
        }

        // Player bullets with boss
        if (boss) {
            player.bullets.forEach(bullet => {
                if (this.checkCollision(bullet, boss)) {
                    bullet.markedForDeletion = true;
                    boss.hit(10); // Assuming each bullet does 10 damage
                }
            });

            // Boss bullets with player
            boss.bullets.forEach(bullet => {
                if (this.checkCollision(bullet, player) && !player.activePowerUps.shield) {
                    bullet.markedForDeletion = true;
                    player.hit();
                }
            });

            // Player with boss
            if (this.checkCollision(player, boss)) {
                player.hit();
                boss.hit(20); // Collision does more damage than bullets
            }
        }
    }
}

export default Collision;