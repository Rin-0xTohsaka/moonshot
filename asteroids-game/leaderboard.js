// leaderboard.js

class Leaderboard {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('spaceShooterScores')) || [];
    }

    addScore(score) {
        this.scores.push(score);
        this.scores.sort((a, b) => b - a);
        this.scores = this.scores.slice(0, 10); // Keep only top 10 scores
        this.saveScores();
    }

    saveScores() {
        localStorage.setItem('spaceShooterScores', JSON.stringify(this.scores));
    }

    getTopScores(count = 10) {
        return this.scores.slice(0, count);
    }

    renderLeaderboard(ctx, x, y) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '20px Courier';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillText('Leaderboard', x, y);
        y += 30;

        this.getTopScores().forEach((score, index) => {
            ctx.fillText(`${index + 1}. ${score}`, x, y);
            y += 25;
        });

        ctx.restore();
    }
}

export default Leaderboard;