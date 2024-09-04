// level.js

class Level {
    constructor(game) {
        this.game = game;
        this.planets = ['Pluto', 'Neptune', 'Uranus', 'Saturn', 'Jupiter', 'Mars', 'Venus', 'Earth'];
        this.transitionDuration = 180; // 3 seconds at 60 FPS
        this.bossDefeatedMessageDuration = 180; // 3 seconds at 60 FPS
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
    }

    start() {
        this.currentLevel++;
        if (this.currentLevel > this.planets.length) {
            this.game.gameWon();
            return;
        }
        this.maxAsteroids = this.currentLevel * 10;
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
                if (this.game.asteroids.length === 0 && this.asteroidCount >= this.maxAsteroids) {
                    this.state = 'boss';
                    this.game.spawnBoss();
                }
                break;
            case 'boss':
                if (this.game.boss && this.game.boss.markedForDeletion) {
                    this.state = 'bossDefeated';
                    this.transitionTimer = 0;
                }
                break;
            case 'bossDefeated':
                this.transitionTimer++;
                if (this.transitionTimer >= this.bossDefeatedMessageDuration) {
                    if (this.currentLevel < this.planets.length) {
                        this.state = 'transition';
                        this.transitionTimer = 0;
                    } else {
                        this.game.gameWon();
                    }
                }
                break;
            case 'transition':
                this.transitionTimer++;
                if (this.transitionTimer >= this.transitionDuration) {
                    this.start();
                }
                break;
        }
    }

    showLevelIntro() {
        this.game.ui.showLevelIntro(this.currentLevel, this.planets[this.currentLevel - 1]);
    }

    bossDefeated() {
        this.state = 'bossDefeated';
        this.transitionTimer = 0;
    }
}

export default Level;