// asteroidConfig.js
// Asteroid-specific settings

export const ASTEROID_COUNT = 2; // This + current level = number of asteroids.
export const ASTEROID_GENERATIONS = 3; // How many times do they split before dying?
export const ASTEROID_CHILDREN = 2; // How many does each death create?
export const ASTEROID_SPEED = 3;
export const ASTEROID_SCORE = 10; // How many points is each one worth?

export const ASTEROID_RADIUS = 7;

export const ASTEROID_PATH = [
    [1, 7],
    [5, 5],
    [7, 1],
    [5, -3],
    [7, -7],
    [3, -9],
    [-1, -5],
    [-4, -2],
    [-8, -1],
    [-9, 3],
    [-5, 5],
    [-1, 3],
    [1, 7]
];