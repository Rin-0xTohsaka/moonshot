import Minion from './minion.js';
import congratulationsMessages from './congratulationsMessages.js';

// level.js

class Level {
    constructor(game) {
        this.game = game;
        this.planets = [
            // Solar system planets
            'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
            // Additional planets
            'Ocean World Alpha', 'Ocean World Beta', 'Ocean World Prime',
            'TM 01', 'TM 02', 'TM 03',
            'SPNV 01', 'SPNV 02',
            'Dyson Alpha', 'Dyson Beta', 'Dyson Gamma', 'Dyson Omega', 'Dyson Prime',
            'X Prime', 'X49 Prime', 'Terra'
        ];
        this.transitionDuration = 180; // 3 seconds at 60 FPS
        this.congratulationsDelay = 300; // 5 seconds at 60 FPS
        this.levelIntroDelay = 300; // 5 seconds at 60 FPS
        this.reset();
    }

    reset() {
        this.currentLevel = 0;
        this.asteroidCount = 0;
        this.maxAsteroids = 0;
        this.asteroidSpawnInterval = 60;
        this.asteroidTimer = 0;
        this.state = 'intro';
        this.transitionTimer = 0;
        this.minionCount = 0;
        this.maxMinions = 0;
        this.minionTimer = 0;
        this.congratulationsMessage = '';
        this.minionSpawnInterval = 180; // Add this line (3 seconds at 60 FPS)
    }

    start() {
        this.currentLevel++;
        // console.log('Starting level:', this.currentLevel);
        if (this.currentLevel > this.planets.length) {
            this.game.gameWon();
            return;
        }
        this.maxAsteroids = Math.min(this.currentLevel * 8, 64);
        this.maxMinions = Math.min(Math.floor(this.currentLevel / 2), 10);
        this.minionCount = 0;
        this.asteroidCount = 0;
        this.state = 'intro';
        this.showLevelIntro();
    }

    update(deltaTime) {
        switch (this.state) {
            case 'intro':
                this.transitionTimer++;
                if (this.transitionTimer >= this.transitionDuration) {
                    this.state = 'asteroids';
                    this.transitionTimer = 0;
                }
                break;
            case 'asteroids':
                this.asteroidTimer++;
                if (this.asteroidTimer >= this.asteroidSpawnInterval && this.asteroidCount < this.maxAsteroids) {
                    this.game.addAsteroid();
                    this.asteroidCount++;
                    this.asteroidTimer = 0;
                }
                
                // Spawn minions
                this.minionTimer++;
                if (this.minionTimer >= this.minionSpawnInterval && this.minionCount < this.maxMinions) {
                    this.game.minions.push(new Minion(this.game));
                    this.minionCount++;
                    this.minionTimer = 0;
                }

                if (this.game.asteroids.length === 0 && this.game.minions.length === 0 && this.asteroidCount >= this.maxAsteroids) {
                    this.state = 'boss';
                    this.game.spawnBoss();
                }
                break;
            case 'boss':
                if (this.game.boss && this.game.boss.markedForDeletion) {
                    this.state = 'bossDefeated';
                    this.transitionTimer = 0;
                    this.congratulationsMessage = congratulationsMessages[this.currentLevel - 1];
                }
                break;
            case 'bossDefeated':
                this.transitionTimer++;
                if (this.transitionTimer >= this.congratulationsDelay) {
                    this.state = 'levelIntro';
                    this.transitionTimer = 0;
                    this.showLevelIntro();
                }
                break;
            case 'levelIntro':
                this.transitionTimer++;
                if (this.transitionTimer >= this.levelIntroDelay) {
                    this.start();
                }
                break;
        }
    }

    showLevelIntro() {
        this.game.ui.showLevelIntro(this.game.ctx, this.currentLevel, this.planets[this.currentLevel - 1]);
    }

    bossDefeated() {
        this.state = 'bossDefeated';
        this.transitionTimer = 0;
        this.congratulationsMessage = congratulationsMessages[this.currentLevel - 1] || "Great job! You've defeated another boss!";
    }
}

export default Level;