// powerUpMenu.js
// Handles the power-up selection menu

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export function createPowerUpMenu(game) {
    let selectedIndex = 0;
    let active = false;
    const powerUpTypes = Object.keys(game.powerUps.getPowerUpTypes());

    function drawMenu(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        ctx.fillText('Select a Power-Up', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);

        powerUpTypes.forEach((type, index) => {
            if (index === selectedIndex) {
                ctx.fillStyle = 'yellow';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillText(`${type.toUpperCase()}: ${game.powerUps.getPowerUpTypes()[type].count}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + index * 30);
        });

        ctx.restore();
    }

    function open() {
        active = true;
        document.addEventListener('keydown', handleKeyDown);
    }

    function close() {
        active = false;
        document.removeEventListener('keydown', handleKeyDown);
        const selectedPowerUp = powerUpTypes[selectedIndex];
        if (selectedPowerUp) {
            game.powerUps.usePowerUp(selectedPowerUp);
        }
        game.state = 'playing';  // Resume the game state
    }

    function handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
                selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : powerUpTypes.length - 1;
                break;
            case 'ArrowDown':
                selectedIndex = (selectedIndex < powerUpTypes.length - 1) ? selectedIndex + 1 : 0;
                break;
            case 'Enter':
            case ' ':
                close();
                break;
            default:
                break;
        }
    }

    function updateAndDraw(ctx) {
        if (active) {
            drawMenu(ctx);
        }
    }

    return {
        open,
        close,
        updateAndDraw,
    };
}
