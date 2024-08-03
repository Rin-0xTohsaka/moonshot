// levelManager.js file

class LevelManager {
    constructor(maxLevels = 30) {
        this.currentLevel = 1;
        this.maxLevels = maxLevels;
        this.levelObjectives = this.initializeLevelObjectives();
    }

    initializeLevelObjectives() {
        let objectives = {};
        for (let i = 1; i <= this.maxLevels; i++) {
            objectives[i] = this.getObjectiveForLevel(i);
        }
        return objectives;
    }

    getObjectiveForLevel(level) {
        // Define specific objectives for each level
        if (level <= 5) {
            return "Destroy 10 asteroids";
        } else if (level <= 10) {
            return "Collect 3 power-ups";
        } else if (level <= 15) {
            return "Destroy asteroids using only power-ups";
        } else if (level <= 20) {
            return "Destroy 15 asteroids, collect 5 power-ups, then defeat an enemy ship";
        } else if (level <= 25) {
            return "Defeat a boss and survive for 3 minutes";
        } else {
            return "Defeat the final boss and land on the moon";
        }
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getCurrentObjective() {
        return this.levelObjectives[this.currentLevel];
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevels) {
            this.currentLevel++;
            return true;
        }
        return false;
    }

    isGameComplete() {
        return this.currentLevel > this.maxLevels;
    }
}

export default LevelManager;
