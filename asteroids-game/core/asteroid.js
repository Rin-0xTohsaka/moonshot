// asteroid.js
// Asteroid object and related methods

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { ASTEROID_RADIUS, ASTEROID_PATH, ASTEROID_SPEED, ASTEROID_GENERATIONS } from '../config/asteroidConfig.js';
import { move } from '../utils/movement.js';
import { drawPath } from '../utils/drawing.js';

export function createAsteroid(game, _gen) {
    const asteroid = {
        position: [0, 0],
        velocity: [0, 0],
        direction: 0,
        generation: _gen,
        frozen: false, // New property to track if the asteroid is frozen
        frozenTimeout: null // To store the timeout ID for unfreezing
    };

    asteroid.getPosition = () => asteroid.position;
    asteroid.setPosition = (pos) => {
        asteroid.position = pos;
    };
    asteroid.getVelocity = () => asteroid.velocity;
    asteroid.setVelocity = (vel) => {
        asteroid.velocity = vel;
        asteroid.direction = Math.atan2(vel[1], vel[0]);
    };
    asteroid.getSpeed = () => Math.sqrt(Math.pow(asteroid.velocity[0], 2) + Math.pow(asteroid.velocity[1], 2));
    asteroid.getRadius = () => ASTEROID_RADIUS * asteroid.generation;
    asteroid.getGeneration = () => asteroid.generation;

    asteroid.move = () => {
        if (!asteroid.frozen) {
            move(asteroid.position, asteroid.velocity);
        }
    };

    asteroid.draw = (ctx) => {
        console.log('Drawing asteroid', {
            position: asteroid.position,
            direction: asteroid.direction,
            generation: asteroid.generation,
            path: ASTEROID_PATH
        });
        drawPath(ctx, asteroid.position, asteroid.direction, asteroid.generation, ASTEROID_PATH);
        console.log('Asteroid draw complete');
    };

    asteroid.freeze = (duration) => {
        asteroid.frozen = true;
        if (asteroid.frozenTimeout) {
            clearTimeout(asteroid.frozenTimeout); // Clear any existing timeout
        }
        asteroid.frozenTimeout = setTimeout(() => {
            asteroid.frozen = false;
            console.log('Asteroid unfrozen:', asteroid);
        }, duration);
    };

    return asteroid;
}

export function createAsteroids(game) {
    const asteroids = [];

    return {
        push: (obj) => asteroids.push(obj),
        pop: () => asteroids.pop(),
        splice: (i, j) => asteroids.splice(i, j),
        get length() {
            return asteroids.length;
        },
        getIterator: () => asteroids,
        clear: () => {
            asteroids.length = 0;
        },
        generationCount: (_gen) => {
            let total = 0;
            for (let i = 0; i < asteroids.length; i++) {
                if (asteroids[i].getGeneration() == _gen)
                    total++;
            }
            game.log.debug('Found ' + total + ' asteroids in generation ' + _gen);
            return total;
        },
        createNewAsteroid: () => {
            const a = createAsteroid(game, ASTEROID_GENERATIONS);
            a.setPosition([
                Math.random() * GAME_WIDTH,
                Math.random() * GAME_HEIGHT
            ]);
            a.setVelocity([
                Math.random() * ASTEROID_SPEED - ASTEROID_SPEED / 2,
                Math.random() * ASTEROID_SPEED - ASTEROID_SPEED / 2
            ]);
            asteroids.push(a);
            return a;
        },
        createChildAsteroids: (parent, count) => {
            const children = [];
            const _gen = parent.getGeneration() - 1;
            if (_gen > 0) {
                for (let i = 0; i < count; i++) {
                    const a = createAsteroid(game, _gen);
                    a.setPosition([...parent.getPosition()]);
                    a.setVelocity([
                        Math.random() * ASTEROID_SPEED - ASTEROID_SPEED / 2,
                        Math.random() * ASTEROID_SPEED - ASTEROID_SPEED / 2
                    ]);
                    children.push(a);
                    asteroids.push(a);
                }
            }
            return children;
        },
        freezeAsteroids: () => {
            asteroids.forEach(asteroid => {
                asteroid.freeze(5000); // Freeze each asteroid for 5 seconds
            });
            console.log('All asteroids frozen');
        }
    };
}
