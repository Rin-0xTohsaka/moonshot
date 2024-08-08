// input/eventListeners.js
// Event listener setup

import { LEFT, UP, RIGHT, FIRE } from '../config/gameConfig.js';
import { createKeyState } from './keyState.js';

export function setupEventListeners(game) {
    const keyMap = {
        "ArrowLeft": LEFT,
        "KeyA": LEFT,
        "ArrowRight": RIGHT,
        "KeyD": RIGHT,
        "ArrowUp": UP,
        "KeyW": UP,
        "Space": FIRE
    };

    window.addEventListener('keydown', function(e) {
        const state = keyMap[e.code];
        if (state) {
            e.preventDefault();
            e.stopPropagation();
            game.keyState.on(state);
            return false;
        }
        return true;
    }, true);

    window.addEventListener('keyup', function(e) {
        const state = keyMap[e.code];
        if (state) {
            e.preventDefault();
            e.stopPropagation();
            game.keyState.off(state);
            return false;
        }
        return true;
    }, true);
}

export { createKeyState };