// powerups.js
// Power-up handling logic

export function createPowerUps(game) {
    const powerUpTypes = {
        extraLife: { count: 0, symbol: '1UP', color: 'green' },
        shield: { count: 0, symbol: 'S', color: 'blue' },
        freeze: { count: 0, symbol: 'F', color: 'cyan' },
        bulletUpgrade: { count: 0, symbol: 'B', color: 'orange' }
    };

    function usePowerUp(type) {
        if (powerUpTypes[type] && powerUpTypes[type].count > 0) {
            powerUpTypes[type].count--;
            applyEffect(type);
            game.info.updatePowerUp(type, powerUpTypes[type].count);
        } else {
            console.warn(`Power-up ${type} is not available or count is zero.`);
        }
    }

    function applyEffect(type) {
        switch (type) {
            case 'extraLife':
                game.player.addLife();
                game.info.setLives(game.player.getLives());
                break;
            case 'shield':
                game.player.activateShield();
                break;
            case 'freeze':
                game.asteroids.freezeAsteroids();
                break;
            case 'bulletUpgrade':
                game.player.upgradeBullets(); // Now tied to player behavior
                break;
        }
        console.log(`Power-up ${type} applied!`);
    }

    function drawIcons(ctx) {
        let x = 20;  // Starting x position for power-up icons
        const y = 30;  // y position for power-up icons
        const iconSize = 25;

        Object.keys(powerUpTypes).forEach(type => {
            ctx.fillStyle = powerUpTypes[type].color;
            ctx.fillRect(x, y, iconSize, iconSize);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(powerUpTypes[type].symbol, x + iconSize / 2, y + iconSize / 2 + 2);

            // Draw count next to icon
            ctx.fillText(`x${powerUpTypes[type].count}`, x + iconSize + 5, y + iconSize / 2 + 2);
            x += 80;  // Move to the next position for the next icon
        });
    }

    function addPowerUp(type, count) {
        if (powerUpTypes[type]) {
            powerUpTypes[type].count = count;
            game.info.updatePowerUp(type, count);
        } else {
            console.warn(`Power-up type ${type} does not exist.`);
        }
    }

    return {
        usePowerUp,
        drawIcons,
        addPowerUp,
        getPowerUpTypes: () => powerUpTypes  // Added to access power-up types externally
    };
}
