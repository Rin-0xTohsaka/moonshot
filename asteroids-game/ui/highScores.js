// ui/highScores.js
// High score handling

export function createHighScores(game) {
    let scores = [];

    if (localStorage.getItem('high-scores')) {
        scores = JSON.parse(localStorage.getItem('high-scores'));
    }
    
    return {
        getScores: function() {
            return scores;
        },
        addScore: function(_name, _score) {
            scores.push({name: _name, score: _score});
            scores.sort((a, b) => b.score - a.score);
            if (scores.length > 10) {
                scores.length = 10;
            }
            game.log.debug('Saving high scores.');
            localStorage.setItem('high-scores', JSON.stringify(scores));
        },
    };
}