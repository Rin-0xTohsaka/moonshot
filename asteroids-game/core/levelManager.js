// core/levelManager.js

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

const LEVELS = [
    { name: "Pluto", asteroidCount: 5, objective: "Clear all asteroids" },
    { name: "Neptune", asteroidCount: 10, objective: "Clear all asteroids" },
    { name: "Uranus", asteroidCount: 15, objective: "Clear all asteroids" },
    { name: "Saturn", asteroidCount: 20, objective: "Clear all asteroids" },
    { name: "Jupiter", asteroidCount: 25, objective: "Clear all asteroids" },
    { name: "Mars", asteroidCount: 30, objective: "Clear all asteroids" },
    { name: "Venus", asteroidCount: 35, objective: "Clear all asteroids" },
    { name: "Mercury", asteroidCount: 40, objective: "Clear all asteroids" },
    { name: "Earth", asteroidCount: 50, objective: "Clear all asteroids and defeat the boss" }
];

export function createLevelManager(game) {
    let currentLevelIndex = 0;

    return {
        getCurrentLevel: () => LEVELS[currentLevelIndex],
        
        startNextLevel: () => {
            if (currentLevelIndex < LEVELS.length - 1) {
                currentLevelIndex++;
                game.log.debug(`Advancing to level ${currentLevelIndex + 1}: ${LEVELS[currentLevelIndex].name}`);
                return true;
            }
            game.log.debug('All levels completed');
            return false;
        },

        resetLevels: () => {
            currentLevelIndex = 0;
            game.log.debug('Levels reset to beginning');
        },

        isLevelComplete: () => {
            return game.asteroids.length === 0;
        },

        setupLevel: () => {
            const level = LEVELS[currentLevelIndex];
            game.asteroids.clear();
            for (let i = 0; i < level.asteroidCount; i++) {
                game.asteroids.createNewAsteroid();
            }
            game.log.debug(`Level ${currentLevelIndex + 1} (${level.name}) set up with ${level.asteroidCount} asteroids`);
        }
    };
}