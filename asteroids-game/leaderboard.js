// leaderboard.js

class Leaderboard {
    constructor() {
        this.scores = [];
        this.maxEntries = 50;
        this.localStorageKey = 'moonshot_leaderboard';
        this.loadScores();
    }

    loadScores() {
        const storedScores = localStorage.getItem(this.localStorageKey);
        if (storedScores) {
            this.scores = JSON.parse(storedScores);
        } else {
            this.fetchScoresFromGitHub();
        }
    }

    async fetchScoresFromGitHub() {
        try {
            // Updated URL to reflect the new location of leaderboard.json
            const response = await fetch('https://raw.githubusercontent.com/Rin-0xTohsaka/moonshot/main/asteroids-game/leaderboard.json');
            if (response.ok) {
                const data = await response.json();
                this.scores = data.scores;
                this.saveScores();
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard from GitHub:', error);
        }
    }

    saveScores() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.scores));
    }

    addScore(name, score) {
        this.scores.push({ name, score });
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, this.maxEntries);
        this.saveScores();
    }

    isHighScore(score) {
        return this.scores.length < this.maxEntries || score > this.scores[this.scores.length - 1].score;
    }

    getTopScores(count = 10) {
        return this.scores.slice(0, count);
    }
}

export default Leaderboard;