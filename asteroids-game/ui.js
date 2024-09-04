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
            this.fontSize = Math.max(10, Math.floor(this.game.width / 40)); // Reduced from 12 and 30
        } else {
            this.fontSize = 14; // Reduced from 16
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
        ctx.fillText(`SCORE: ${this.game.score}`, 20, 20);

        // Lives
        ctx.fillText(`LIVES: ${this.game.lives}`, 20, 40);

        // Level
        ctx.fillText(`LEVEL: ${this.game.level.currentLevel}`, 20, 60);

        // Render active power-ups
        this.renderActivePowerUps(ctx);

        // Add sound and music toggle buttons
        this.renderToggleButtons(ctx);

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
                const powerUpImage = new Image();
                powerUpImage.src = `assets/powerups/${type}.png`;
                
                if (powerUpImage.complete) {
                    ctx.drawImage(powerUpImage, x, y, this.powerUpSize, this.powerUpSize);
                } else {
                    // Fallback if image hasn't loaded
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
        ctx.font = `${Math.floor(this.fontSize * 1.8)}px ${this.fontFamily}`; // Reduced multiplier
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Boss Defeated!', this.game.width / 2, this.game.height / 4);
        
        // Display next planet info
        const nextLevel = this.game.level.currentLevel + 1;
        if (nextLevel <= this.game.level.planets.length) {
            const nextPlanet = this.game.level.planets[nextLevel - 1];
            
            // Load and display planet image
            const planetImage = new Image();
            planetImage.src = `assets/planets/${nextPlanet.toLowerCase()}.png`;
            
            if (planetImage.complete) {
                const imgSize = 150;
                ctx.drawImage(planetImage, 
                    this.game.width / 2 - imgSize / 2, 
                    this.game.height / 2 - imgSize / 2, 
                    imgSize, imgSize);
            }
            
            ctx.font = `${Math.floor(this.fontSize * 1.3)}px ${this.fontFamily}`; // Reduced multiplier
            ctx.fillText(`Next Destination: ${nextPlanet}`, this.game.width / 2, this.game.height * 3/4 - 30);
            
            ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            ctx.fillText(`Level ${nextLevel} Objective: Clear the asteroid field`, this.game.width / 2, this.game.height * 3/4 + 8);
            ctx.fillText(`and defeat the ${nextPlanet} boss!`, this.game.width / 2, this.game.height * 3/4 + 30);
        } else {
            ctx.font = `30px ${this.fontFamily}`;
            ctx.fillText("Congratulations! You've cleared all levels!", this.game.width / 2, this.game.height * 3/4);
        }
        
        ctx.restore();
    }

    renderToggleButtons(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 0.9)}px ${this.fontFamily}`; // Reduced multiplier
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;

        // Sound toggle button
        const soundText = this.game.audio.isSoundMuted ? 'SOUND: OFF' : 'SOUND: ON';
        ctx.fillText(soundText, 20, this.game.height - 60);

        // Music toggle button
        const musicText = this.game.audio.isMusicMuted ? 'MUSIC: OFF' : 'MUSIC: ON';
        ctx.fillText(musicText, 20, this.game.height - 30);

        ctx.restore();
    }
}

export default UI;