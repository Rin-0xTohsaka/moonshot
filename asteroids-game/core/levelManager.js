// levelManager.js
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { createBoss } from './boss.js';
import { getAssetsForLevel } from '../config/assetMapping.js';

const LEVELS = [
    { name: "Pluto", asteroidCount: 5, objective: "Clear all asteroids", hasBoss: true },
    { name: "Neptune", asteroidCount: 10, objective: "Clear all asteroids", hasBoss: true },
    { name: "Uranus", asteroidCount: 15, objective: "Clear all asteroids", hasBoss: true },
    { name: "Saturn", asteroidCount: 20, objective: "Clear all asteroids", hasBoss: true },
    { name: "Jupiter", asteroidCount: 25, objective: "Clear all asteroids", hasBoss: true },
    { name: "Mars", asteroidCount: 30, objective: "Clear all asteroids", hasBoss: true },
    { name: "Venus", asteroidCount: 35, objective: "Clear all asteroids", hasBoss: true },
    { name: "Mercury", asteroidCount: 40, objective: "Clear all asteroids", hasBoss: true },
    { name: "Earth", asteroidCount: 50, objective: "Clear all asteroids and defeat the boss", hasBoss: true }
];

export function createLevelManager(game) {
    let currentLevelIndex = 0;
    let bossDefeated = false;

    function isLevelComplete() {
        const currentLevel = LEVELS[currentLevelIndex];
        console.log("Checking if level is complete");
        console.log("Current level has boss:", currentLevel.hasBoss);
        console.log("Asteroids remaining:", game.asteroids.length);
        console.log("Boss exists:", !!game.boss);
        console.log("Boss health:", game.boss ? game.boss.getHealth() : "N/A");
    
        if (currentLevel.hasBoss) {
            if (game.asteroids.length === 0 && !game.boss) {
                console.log("Asteroids cleared, boss not spawned yet");
                return false;
            }
            return game.boss && game.boss.getHealth() <= 0;
        }
        return game.asteroids.length === 0;
    }

    function handleLevelCompletion() {
        console.log("Handling level completion");
        console.log("Asteroids remaining:", game.asteroids.length);
        console.log("Current level:", LEVELS[currentLevelIndex]);
        console.log("Boss exists:", !!game.boss);
        console.log("Boss defeated:", bossDefeated);
    
        const currentLevel = LEVELS[currentLevelIndex];
        if (game.asteroids.length === 0 && currentLevel.hasBoss && !game.boss && !bossDefeated) {
            console.log("Conditions met for boss battle. Setting up boss.");
            setupBoss();
        } else if (isLevelComplete()) {
            console.log("Level is complete. Moving to next level or ending game.");
            bossDefeated = false;
            if (startNextLevel()) {
                game.play();
            } else {
                game.gameOver(true);
            }
        } else {
            console.log("Level not complete yet.");
        }
    }

    function setupBoss() {
        console.log("Setting up boss battle");
        const currentLevel = LEVELS[currentLevelIndex];
        const assets = getAssetsForLevel(currentLevelIndex);
        console.log("Assets for this level:", assets);
        
        const bossConfig = {
            spritePath: `assets/alien-bosses/${assets.boss}`,
            entityPath: `assets/alien-entities/${assets.entity}`,
            health: 200,
            size: 100,
            shieldActive: true,
            shieldRotationSpeed: 0.05,
            minionSpawnRate: 2000,
            maxMinions: 3 + currentLevelIndex,
            minionConfig: {
                spritePath: `assets/aliens-minions/${assets.minion}`,
                entityPath: `assets/alien-entities/${assets.entity}`,
                health: 30,
                speed: 2 + (currentLevelIndex * 0.5),
                size: 50
            }
        };
        game.boss = createBoss(game, bossConfig);
        console.log("Boss created:", game.boss);
        game.log.debug(`Boss battle set up for ${currentLevel.name} with assets: `, assets);
    }

    function startNextLevel() {
        if (currentLevelIndex < LEVELS.length - 1) {
            currentLevelIndex++;
            game.log.debug(`Advancing to level ${currentLevelIndex + 1}: ${LEVELS[currentLevelIndex].name}`);
            setupLevel();
            return true;
        }
        game.log.debug('All levels completed');
        return false;
    }

    function setupLevel() {
        const level = LEVELS[currentLevelIndex];
        game.asteroids.clear();
        for (let i = 0; i < level.asteroidCount; i++) {
            game.asteroids.createNewAsteroid();
        }
        game.log.debug(`Level ${currentLevelIndex + 1} (${level.name}) set up with ${level.asteroidCount} asteroids`);
        game.boss = null;
        bossDefeated = false;
    }

    return {
        getCurrentLevel: () => LEVELS[currentLevelIndex],
        startNextLevel: startNextLevel,
        resetLevels: () => {
            currentLevelIndex = 0;
            bossDefeated = false;
            game.log.debug('Levels reset to beginning');
        },
        isLevelComplete: isLevelComplete,
        handleLevelCompletion: handleLevelCompletion,
        setupLevel: setupLevel
    };
}
