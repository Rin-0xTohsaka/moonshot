// ui/infoPane.js
// Information panel logic with retro styling

import { PLAYER_LIVES } from '../config/playerConfig.js';

export function createInfoPane(game, home) {
    // Create a container for the overall info pane
    const pane = document.createElement('div');
    pane.className = 'info-pane';
    pane.style.position = 'absolute';
    pane.style.width = '100%';
    pane.style.top = '0';
    pane.style.left = '0';
    pane.style.display = 'flex';
    pane.style.justifyContent = 'space-between';
    pane.style.pointerEvents = 'none';

    // Left-side container (for lives and score)
    const leftPane = document.createElement('div');
    leftPane.style.flex = '1';
    leftPane.style.display = 'flex';
    leftPane.style.flexDirection = 'column';
    leftPane.style.padding = '10px';

    const lives = document.createElement('div');
    lives.className = 'stat lives';
    lives.innerHTML = 'LIVES: ' + PLAYER_LIVES;
    lives.style.color = 'green';

    leftPane.appendChild(lives);
    pane.appendChild(leftPane);

    // Center container (for game title)
    const centerPane = document.createElement('div');
    centerPane.style.flex = '1';
    centerPane.style.display = 'flex';
    centerPane.style.justifyContent = 'center';
    centerPane.style.padding = '10px';

    const title = document.createElement('div');
    title.className = 'game-title';
    title.textContent = 'MOONSHOT';
    title.style.color = 'green';

    centerPane.appendChild(title);
    pane.appendChild(centerPane);

    // Right-side container (for level)
    const rightPane = document.createElement('div');
    rightPane.style.flex = '1';
    rightPane.style.display = 'flex';
    rightPane.style.justifyContent = 'flex-end';
    rightPane.style.padding = '10px';

    const level = document.createElement('div');
    level.className = 'stat level';
    level.innerHTML = 'LEVEL: Pluto'; // Set initial level name
    level.style.color = 'green';

    rightPane.appendChild(level);
    pane.appendChild(rightPane);

    // Add the info pane to the home element
    home.appendChild(pane);

    // Create a container for power-up icons and counters at the bottom-left corner
    const powerUpPane = document.createElement('div');
    powerUpPane.style.position = 'absolute';
    powerUpPane.style.bottom = '10px';
    powerUpPane.style.left = '10px';
    powerUpPane.style.display = 'flex';
    powerUpPane.style.flexDirection = 'column';
    powerUpPane.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    powerUpPane.style.padding = '5px';
    powerUpPane.style.borderRadius = '8px';

    Object.keys(game.powerUps.getPowerUpTypes()).forEach(type => {
        const powerUpDisplay = document.createElement('div');
        powerUpDisplay.className = `powerup-${type} stat powerup`;
        powerUpDisplay.innerHTML = `${type.toUpperCase()}: 0`;
        powerUpDisplay.style.color = 'green';
        powerUpPane.appendChild(powerUpDisplay);
    });

    home.appendChild(powerUpPane);

    function updatePowerUp(type, count) {
        const powerUpDisplay = document.querySelector(`.powerup-${type}`);
        if (powerUpDisplay) {
            powerUpDisplay.innerHTML = `${type.toUpperCase()}: ${count}`;
        }
    }

    return {
        setLives: function(l) {
            lives.innerHTML = 'LIVES: ' + l;
        },
        setScore: function(s) {
            // Score could be added here if needed
        },
        setLevel: function(levelName) {
            level.innerHTML = 'LEVEL: ' + levelName;
        },
        updatePowerUp,
        getPane: function() {
            return pane;
        }
    };
}
