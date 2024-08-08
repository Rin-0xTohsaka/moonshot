// level.js
// Level management and progression

import { ASTEROID_COUNT, ASTEROID_GENERATIONS } from '../config/asteroidConfig.js';

export function createLevel(game) {
    let level = 0;

    return {
        getLevel: () => level,
        levelUp: () => {
            level++;
            game.log.debug('Congrats! On to level ' + level);
            while (game.asteroids.generationCount(ASTEROID_GENERATIONS) < level + ASTEROID_COUNT) {
                game.asteroids.createNewAsteroid();
            }
        }
    };
}