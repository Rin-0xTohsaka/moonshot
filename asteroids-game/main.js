// main.js
// Entry point for the game, imports and initializes all modules

import { createGame } from './core/game.js';
import { GAME_WIDTH, GAME_HEIGHT } from './config/gameConfig.js';

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('asteroids');
    if (!container) {
        console.error('Could not find container element');
        return;
    }

    // Set up the game container
    container.style.width = `${GAME_WIDTH}px`;
    container.style.height = `${GAME_HEIGHT}px`;
    container.style.position = 'relative';
    container.style.margin = '50px auto';
    container.style.border = '1px solid #fff';

    // Create and start the game
    const game = createGame(container);
    game.play();
});