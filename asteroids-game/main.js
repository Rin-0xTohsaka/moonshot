// main.js
// Entry point for the game, imports and initializes all modules

import { createGame } from './core/game.js';
import { GAME_WIDTH, GAME_HEIGHT } from './config/gameConfig.js';

document.addEventListener('keydown', (e) => {
    console.log(`Global Key pressed: ${e.code}`);
});

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

    container.tabIndex = 0; // Make it focusable
    container.focus(); // Set focus to the container
    console.log('Container focus state:', document.activeElement === container);

    // Create and start the game
    const game = createGame(container);
    game.play();
});

