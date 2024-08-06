// input/keyState.js
// Key state tracking

import { LEFT, UP, RIGHT, DOWN, FIRE } from '../config/gameConfig.js';

export function createKeyState() {
    const state = {
        [LEFT]: false,
        [UP]: false,
        [RIGHT]: false,
        [DOWN]: false,
        [FIRE]: false
    };

    return {
        on: function(key) {
            state[key] = true;
        },
        off: function(key) {
            state[key] = false;
        },
        getState: function(key) {
            return state[key] || false;
        }
    };
}