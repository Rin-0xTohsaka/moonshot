export class Minion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15; // Adjust as needed
        this.health = 20; // Adjust as needed
    }

    takeDamage(amount) {
        minion.health -= amount;
        game.log.debug(`Minion took ${amount} damage. Health is now ${minion.health}`);
        if (minion.health <= 0) {
            game.log.debug('Minion defeated!');
            // Minion removal is handled in the game loop
        }
    }

    // ... other methods ...
}