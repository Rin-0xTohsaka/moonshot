// ui.js

class UI {
    constructor(game) {
        this.game = game;
        this.setFontSize();
        this.color = '#0ff';
        this.powerUpSize = 25; // Reduced from 30
        this.powerUpPadding = 8; // Reduced from 10
    }

    setFontSize() {
        if (this.game.isMobile) {
            this.fontSize = Math.max(8, Math.floor(this.game.width / 50));
        } else {
            this.fontSize = 14;
        }
        this.fontFamily = "'PressStart2P', 'Courier New', monospace";
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        // Render current game state
        switch (this.game.gameState) {
            case 'menu':
                this.showMainMenu(ctx);
                break;
            case 'playing':
                this.renderPlayingState(ctx);
                break;
            case 'gameOver':
                this.showGameOver(ctx);
                break;
        }

        ctx.restore();
    }

    renderPlayingState(ctx) {
        // Score
        ctx.fillText(`SCORE: ${this.game.score}`, 10, 10);

        // Lives
        ctx.fillText(`LIVES: ${this.game.lives}`, 10, 10 + this.fontSize + 5);

        // Level
        ctx.fillText(`LEVEL: ${this.game.level.currentLevel}`, 10, 10 + (this.fontSize + 5) * 2);

        // Render active power-ups
        this.renderActivePowerUps(ctx);

        // Remove or comment out this line:
        // this.renderToggleButtons(ctx);

        // Show boss defeated message
        if (this.game.level.state === 'bossDefeated') {
            this.showBossDefeatedMessage(ctx);
        }
    }

    renderActivePowerUps(ctx) {
        const activePowerUps = this.game.player.activePowerUps;
        let x = this.game.width - this.powerUpSize - this.powerUpPadding;
        const y = this.powerUpPadding;

        ctx.save();
        for (const [type, isActive] of Object.entries(activePowerUps)) {
            if (isActive) {
                const powerUpImage = this.game.loadedImages[type];
                if (powerUpImage) {
                    ctx.drawImage(powerUpImage, x, y, this.powerUpSize, this.powerUpSize);
                } else {
                    // Fallback if image hasn't loaded (shouldn't happen with preloading)
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x, y, this.powerUpSize, this.powerUpSize);
                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.fillText(type.charAt(0).toUpperCase(), x + 5, y + 20);
                }
                x -= this.powerUpSize + this.powerUpPadding;
            }
        }
        ctx.restore();
    }

    showMainMenu(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.5)}px ${this.fontFamily}`; // Reduced multiplier
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillText('MOONSHOT', this.game.width / 2, this.game.height / 2 - 40);
        
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillText('PRESS ENTER TO START', this.game.width / 2, this.game.height / 2 + 30);
        ctx.restore();
    }

    showGameOver(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.8)}px ${this.fontFamily}`; // Reduced multiplier
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', this.game.width / 2, this.game.height / 2 - 30);
        
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillText(`Final Score: ${this.game.score}`, this.game.width / 2, this.game.height / 2 + 15);
        ctx.fillText('Press ENTER to Restart', this.game.width / 2, this.game.height / 2 + 45);
        ctx.restore();
    }

    showLevelIntro(level, planet) {
        // Implement level intro screen
    }

    showLevelComplete(level, planet) {
        // Implement level complete screen
    }

    showPowerUpMenu(ctx) {
        // Implement power-up menu
    }

    showBossDefeatedMessage(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.8)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Boss Defeated!', this.game.width / 2, this.game.height / 4);
        
        const nextLevel = this.game.level.currentLevel + 1;
        if (nextLevel <= this.game.level.planets.length) {
            const nextPlanet = this.game.level.planets[nextLevel - 1].toLowerCase();
            
            // Use preloaded planet image
            const planetImage = this.game.loadedImages[nextPlanet];
            if (planetImage) {
                const imgSize = Math.min(150, this.game.width * 0.4); // Responsive image size
                ctx.drawImage(planetImage, 
                    this.game.width / 2 - imgSize / 2, 
                    this.game.height / 2 - imgSize / 2, 
                    imgSize, imgSize);
            }
            
            ctx.font = `${Math.floor(this.fontSize * 1.3)}px ${this.fontFamily}`;
            ctx.fillText(`Next Destination: ${nextPlanet.charAt(0).toUpperCase() + nextPlanet.slice(1)}`, this.game.width / 2, this.game.height * 3/4 - 30);
            
            ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            const objective1 = `Level ${nextLevel} Objective: Clear the asteroid field`;
            const objective2 = `and defeat the ${nextPlanet} boss!`;
            
            // Adjust text position for mobile
            if (this.game.isMobile) {
                ctx.fillText(objective1, this.game.width / 2, this.game.height * 3/4 + 8);
                ctx.fillText(objective2, this.game.width / 2, this.game.height * 3/4 + 30);
            } else {
                ctx.fillText(`${objective1} ${objective2}`, this.game.width / 2, this.game.height * 3/4 + 20);
            }
        } else {
            ctx.font = `${this.fontSize * 1.5}px ${this.fontFamily}`;
            ctx.fillText("Congratulations!", this.game.width / 2, this.game.height / 2);
            ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            ctx.fillText("You've cleared all levels!", this.game.width / 2, this.game.height / 2 + 40);
        }
        
        ctx.restore();
    }

    renderToggleButtons(ctx) {
        // This method is now empty as we don't need to render any text for sound and music toggles
        // The state is now indicated by the glowing buttons in the mobile controls
    }

    showHighScoreDialog(score) {
        const dialog = document.createElement('div');
        dialog.className = 'high-score-dialog';
        dialog.innerHTML = `
            <h2>New High Score: ${score}</h2>
            <p>Enter your name (4 characters):</p>
            <input type="text" maxlength="4" id="highScoreName">
            <button id="submitHighScore">Submit</button>
        `;
        document.body.appendChild(dialog);

        const input = document.getElementById('highScoreName');
        const submitButton = document.getElementById('submitHighScore');

        submitButton.addEventListener('click', () => {
            const name = input.value.toUpperCase().padEnd(4, ' ');
            this.game.submitHighScore(name);
            document.body.removeChild(dialog);
        });
    }

    showLeaderboard(ctx) {
        const topScores = this.game.leaderboard.getTopScores();
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize * 1.5}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillText('Leaderboard', this.game.width / 2, 50);

        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = 'left';
        topScores.forEach((entry, index) => {
            const text = `${index + 1}. ${entry.name} - ${entry.score}`;
            ctx.fillText(text, 50, 100 + index * 30);
        });

        ctx.textAlign = 'center';
        ctx.fillText('Press ENTER to continue', this.game.width / 2, this.game.height - 50);
        ctx.restore();
    }
}

export default UI;