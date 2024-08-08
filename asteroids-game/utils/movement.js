// movement.js
// Movement utilities

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export function move(position, velocity) {
    position[0] += velocity[0];
    if (position[0] < 0)
        position[0] = GAME_WIDTH + position[0];
    else if (position[0] > GAME_WIDTH)
        position[0] -= GAME_WIDTH;

    position[1] += velocity[1];
    if (position[1] < 0)
        position[1] = GAME_HEIGHT + position[1];
    else if (position[1] > GAME_HEIGHT)
        position[1] -= GAME_HEIGHT;
}