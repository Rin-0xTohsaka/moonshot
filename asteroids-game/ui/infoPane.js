// ui/infoPane.js
// Information panel logic with retro styling

import { PLAYER_LIVES } from '../config/playerConfig.js';

export function createInfoPane(game, home) {
    const pane = document.createElement('div');
    pane.className = 'info-pane';

    const title = document.createElement('div');
    title.className = 'game-title';
    title.textContent = 'MOONSHOT';

    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';

    const lives = document.createElement('div');
    lives.className = 'stat lives';
    lives.innerHTML = 'LIVES: ' + PLAYER_LIVES;

    const score = document.createElement('div');
    score.className = 'stat score';
    score.innerHTML = 'SCORE: 0';

    const level = document.createElement('div');
    level.className = 'stat level';
    level.innerHTML = 'LEVEL: 1';

    statsContainer.appendChild(lives);
    statsContainer.appendChild(score);
    statsContainer.appendChild(level);

    pane.appendChild(title);
    pane.appendChild(statsContainer);
    home.appendChild(pane);

    return {
        setLives: function(l) {
            lives.innerHTML = 'LIVES: ' + l;
        },
        setScore: function(s) {
            score.innerHTML = 'SCORE: ' + s;
        },
        setLevel: function(_level) {
            level.innerHTML = 'LEVEL: ' + _level;
        },
        getPane: function() {
            return pane;
        }
    };
}