// ui.js

class UI {
    constructor(game) {
        this.game = game;
        this.setFontSize();
        this.color = '#0ff';
        this.powerUpSize = 25; // Reduced from 30
        this.powerUpPadding = 8; // Reduced from 10
        this.typewriterText = '';
        this.typewriterIndex = 0;
        this.typewriterSpeed = 0.5; // Reduced from 1 to 0.5 character per frame
        this.lineHeight = 30; // Height between lines
        this.maxLineWidth = 0; // Will be set in setFontSize method
        this.typewriterComplete = false;
        this.powerUpDescriptions = {
            speedBoost: 'Speed: Faster',
            shield: 'Shield: Protect',
            multiShot: 'Gun: Multi',
            timeFreeze: 'Clock: Slow',
            life: 'Heart: +Life',
            duplicate: 'Twin: Double',
            laserShots: 'Laser: Spread',

        };
        this.menuItems = [
            { name: 'Moonshot', url: 'https://moonshot-theta.vercel.app/#home' },
            { name: 'Dexscreener', url: '' },
            { name: 'Coingecko', url: '' }
        ];
        this.selectedMenuItem = 0;
    }

    setFontSize() {
        if (this.game.isMobile) {
            this.fontSize = Math.max(8, Math.floor(this.game.width / 50));
        } else {
            this.fontSize = 14;
        }
        this.fontFamily = "'PressStart2P', 'Courier New', monospace";
        this.maxLineWidth = this.game.width * 0.8; // 80% of canvas width
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        switch (this.game.level.state) {
            case 'intro':
            case 'asteroids':
            case 'boss':
                this.renderPlayingState(ctx);
                break;
            case 'bossDefeated':
                this.showBossDefeatedMessage(ctx);
                break;
            case 'levelIntro':
                this.showLevelIntro(ctx, this.game.level.currentLevel + 1, this.game.level.planets[this.game.level.currentLevel]);
                break;
            case 'menu':
                this.showMainMenu(ctx);
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
        ctx.font = `${Math.floor(this.fontSize * 0.8)}px ${this.fontFamily}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (const [type, isActive] of Object.entries(activePowerUps)) {
            if (isActive || type === 'life') {
                const powerUpImage = this.game.loadedImages[type];
                const description = this.powerUpDescriptions[type];

                if (powerUpImage) {
                    // Calculate width of text for background
                    const textWidth = ctx.measureText(description).width;

                    // Draw semi-transparent background for text
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(x - textWidth - 10, y, textWidth + 5, this.powerUpSize);

                    // Draw power-up icon
                    ctx.drawImage(powerUpImage, x, y, this.powerUpSize, this.powerUpSize);
                    
                    // Draw power-up description
                    ctx.fillStyle = this.color;
                    ctx.fillText(description, x - 5, y + this.powerUpSize / 2);
                } else {
                    // Fallback if image hasn't loaded
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x, y, this.powerUpSize, this.powerUpSize);
                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.fillText(type.charAt(0).toUpperCase(), x + 5, y + 20);
                }
                x -= this.powerUpSize + this.powerUpPadding + ctx.measureText(description).width + 15;
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

    showMenu(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.5)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MENU', this.game.width / 2, this.game.height / 4);

        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.menuItems.forEach((item, index) => {
            ctx.fillStyle = index === this.selectedMenuItem ? '#ff0' : this.color;
            ctx.fillText(item.name, this.game.width / 2, this.game.height / 2 + index * 40);
        });

        ctx.font = `${Math.floor(this.fontSize * 0.8)}px ${this.fontFamily}`;
        ctx.fillStyle = this.color;
        ctx.fillText('Use UP/DOWN to navigate, ENTER to select', this.game.width / 2, this.game.height * 3/4);
        ctx.fillText('ESC to return to game', this.game.width / 2, this.game.height * 3/4 + 30);

        ctx.restore();
    }

    navigateMenu(direction) {
        this.selectedMenuItem = (this.selectedMenuItem + direction + this.menuItems.length) % this.menuItems.length;
    }

    selectMenuItem() {
        const selectedItem = this.menuItems[this.selectedMenuItem];
        if (selectedItem.url) {
            window.open(selectedItem.url, '_blank');
        }
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

    showLevelIntro(ctx, level, planet) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.5)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Level ${level}: ${planet}`, this.game.width / 2, this.game.height / 4);

        const planetImage = this.game.loadedImages[planet.toLowerCase()];
        if (planetImage) {
            const imgSize = Math.min(150, this.game.width * 0.4);
            ctx.drawImage(planetImage, 
                this.game.width / 2 - imgSize / 2, 
                this.game.height / 2 - imgSize / 2, 
                imgSize, imgSize);
        }

        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillText(`Mission: Clear the asteroid field`, this.game.width / 2, this.game.height * 3/4 - 20);
        ctx.fillText(`and defeat the ${planet} boss!`, this.game.width / 2, this.game.height * 3/4 + 20);

        ctx.restore();
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
        ctx.font = `${Math.floor(this.fontSize * 1.2)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Display the full message immediately
        const lines = this.wrapText(ctx, this.game.level.congratulationsMessage, this.maxLineWidth);
        const totalHeight = lines.length * this.lineHeight;
        let startY = (this.game.height - totalHeight) / 2;

        lines.forEach((line, index) => {
            ctx.fillText(line, this.game.width / 2, startY + index * this.lineHeight);
        });

        ctx.restore();
    }

    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine !== '') lines.push(currentLine);

        return lines;
    }

    renderToggleButtons(ctx) {
        // This method is now empty as we don't need to render any text for sound and music toggles
        // The state is now indicated by the glowing buttons in the mobile controls
    }

    // Remove these methods
    // showHighScoreDialog(score) { ... }
    // showLeaderboard(ctx) { ... }
}

export default UI;