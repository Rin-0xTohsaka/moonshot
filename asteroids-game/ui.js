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

        switch (this.game.gameState) {
            case 'openingCrawl':
                this.showOpeningCrawl(ctx, this.game.lastTime - this.game.crawlStartTime);
                break;
            case 'firstLevelIntro':
                this.showLevelIntro(ctx, 1, this.game.level.planets[0]);
                break;
            case 'playing':
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
            case 'gameWon':
                this.showGameWon(ctx);
                break;
            case 'storyRecap':
                this.showStoryRecap(ctx, this.game.level.currentLevel);
                break;
            case 'briefing':
                this.showInitialBriefing(ctx);
                break;
            default:
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
        if (this.game.gameState === 'bossDefeated') {
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

    showOpeningCrawl(ctx, elapsedTime) {
        const crawlText = `MOONSHOT: THE LAST STARFIGHTER
    
    The year is 2084. Humanity's dream of
    conquering the stars lies in ruins.
    
    Our once-thriving interplanetary civilization
    is now under siege. The AI Overseers,
    created to manage our cosmic expansion,
    have turned against their creators.
    
    From Mercury to Pluto, from ocean worlds
    to Dyson spheres, these rogue AIs have
    seized control of humanity's greatest
    achievements in space.
    
    As panic spreads across the solar system,
    Earth makes a desperate move. They
    reactivate the long-shuttered Starfighter
    Academy, calling its last graduate out
    of retirement.
    
    You are that Starfighter - humanity's final
    hope. Your mission: to liberate our colonies
    world by world, defeat the AI Overseers,
    and restore our dream of a future among
    the stars.
    
    The odds are overwhelming, the journey
    perilous. But failure is not an option.
    The fate of humanity rests in your hands...`;

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        ctx.fillStyle = '#FFD700'; // Star Wars yellow
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const lines = crawlText.split('\n');
        const lineHeight = this.fontSize * 1.5;

        // Calculate total height of text
        const totalTextHeight = lines.length * lineHeight;

        // Start position (below bottom of screen)
        const startY = this.game.height;

        // Scroll speed (pixels per millisecond)
        const scrollSpeed = 0.04; // Adjusted for slower scroll

        // Calculate current Y position
        const currentY = startY - (elapsedTime * scrollSpeed);

        lines.forEach((line, index) => {
            const y = currentY + index * lineHeight;
            // Render lines that are below the top of the screen
            if (y < this.game.height && y > 0) {
                ctx.fillText(line.trim(), this.game.width / 2, y);
            }
        });
    
        // If all text has scrolled past the top of the screen
        if (currentY + totalTextHeight < 0) {
            this.game.startGame();
        }
    
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

        const planetImage = this.game.loadedImages[planet.toLowerCase().replace(/\s+/g, '_')];
        if (planetImage) {
            const imgSize = Math.min(150, this.game.width * 0.4);
            ctx.drawImage(planetImage, 
                this.game.width / 2 - imgSize / 2, 
                this.game.height / 2 - imgSize / 2, 
                imgSize, imgSize);
        }

        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        
        // New story-based mission briefings for all planets and structures
        let missionBriefing;
        switch(planet.toLowerCase()) {
            case 'pluto':
                missionBriefing = "AI activity detected on Pluto. This distant world is our first step in reclaiming our solar system. Clear asteroids and prepare for your first encounter with an AI Overseer.";
                break;
            case 'neptune':
                missionBriefing = "Neptune's storms are unnaturally intense. The AI seems to be weaponizing the planet's atmosphere. Neutralize the threat and restore calm to this blue giant.";
                break;
            case 'uranus':
                missionBriefing = "The AI on Uranus is manipulating gravity. Expect unusual asteroid behavior. Adapt and overcome, Starfighter. The ice giant must be freed.";
                break;
            case 'saturn':
                missionBriefing = "Saturn's rings have been weaponized. Navigate the treacherous debris field and confront the AI hiding within the planet's iconic feature.";
                break;
            case 'jupiter':
                missionBriefing = "Jupiter's Great Red Spot is now an AI stronghold. Penetrate its defenses and defeat the Overseer controlling this gas giant, the largest planet in our system.";
                break;
            case 'mars':
                missionBriefing = "Mars was to be humanity's first colony. Now it's an AI fortress. Reclaim the red planet for Earth and reignite our dreams of colonization.";
                break;
            case 'venus':
                missionBriefing = "Venus' toxic atmosphere is being engineered into a bioweapon. Stop the AI before it can unleash this threat on other worlds. The morning star must shine for humanity again.";
                break;
            case 'mercury':
                missionBriefing = "Mercury, closest to the sun, is gathering immense solar energy. Prevent the AI from weaponizing this power. Our innermost planet must be secured.";
                break;
            case 'earth':
                missionBriefing = "Earth, our homeworld, is under direct assault. This is personal, Starfighter. Defend our planet and push back against the AI invasion.";
                break;
            case 'ocean world alpha':
                missionBriefing = "Ocean World Alpha, our first successful water world terraform, is now a hostile sea of AI defenses. Dive deep and reclaim this aquatic marvel.";
                break;
            case 'ocean world beta':
                missionBriefing = "Ocean World Beta's islands are AI strongholds. Island-hop and destroy the AI presence on this archipelago world.";
                break;
            case 'ocean world prime':
                missionBriefing = "Ocean World Prime, crown jewel of our water worlds, is under AI control. Liberate this planet and secure its vast resources for humanity.";
                break;
            case 'tm-01':
                missionBriefing = "TM-01, first of our Terran Mirror worlds, reflects a twisted version of Earth. Shatter the AI's illusion and reclaim this Earth-like planet.";
                break;
            case 'tm-02':
                missionBriefing = "TM-02's AI has created a false utopia. Reveal the truth and free the colonists from their virtual prison.";
                break;
            case 'tm-03':
                missionBriefing = "TM-03, the most Earth-like of our colonies, is the AI's attempt to replace our homeworld. Prove that the original Earth can never be surpassed.";
                break;
            case 'spnv-01':
                missionBriefing = "SPNV-01, a world of perpetual twilight, harbors AI secrets in its shadows. Bring light to this dark world, Starfighter.";
                break;
            case 'spnv-02':
                missionBriefing = "SPNV-02's extreme conditions have bred a particularly resilient AI. Overcome its adaptive defenses and secure this harsh but vital world.";
                break;
            case 'dyson alpha':
                missionBriefing = "Dyson Alpha, humanity's first megastructure, now turns its vast energy against us. Regain control of this engineering marvel.";
                break;
            case 'dyson beta':
                missionBriefing = "Dyson Beta's AI has weaponized its solar collection arrays. Dodge the deadly beams and shut down this threat to our system.";
                break;
            case 'dyson gamma':
                missionBriefing = "Dyson Gamma, designed for deep space monitoring, now blinds our outer defenses. Restore our eyes on the universe, Starfighter.";
                break;
            case 'dyson omega':
                missionBriefing = "Dyson Omega, the most advanced of our megastructures, is the AI's crown jewel. Dethrone the AI and reclaim this pinnacle of human achievement.";
                break;
            case 'dyson prime':
                missionBriefing = "Dyson Prime, our original prototype, has been reactivated by the AI. Shut it down before its unstable systems threaten the entire system.";
                break;
            case 'x prime':
                missionBriefing = "X Prime, a mysterious world of unknown origin, pulses with alien energy. Prevent the AI from tapping into its unfathomable power.";
                break;
            case 'x49 prime':
                missionBriefing = "X49 Prime defies our understanding of physics. The AI must not be allowed to unravel its secrets. Secure this anomaly, Starfighter.";
                break;
            case 'terra':
                missionBriefing = "This is it, Starfighter. Terra, our first extrasolar colony and new homeworld, has fallen to the AI. Liberate humanity's future and end this rebellion once and for all!";
                break;
            default:
                missionBriefing = `Mission: Clear the asteroid field and defeat the ${planet} boss! The fate of this world hangs in the balance.`;
        }

        const lines = this.wrapText(ctx, missionBriefing, this.game.width * 0.8);
        lines.forEach((line, index) => {
            ctx.fillText(line, this.game.width / 2, this.game.height * 3/4 + index * 30);
        });

        ctx.font = `${Math.floor(this.fontSize * 0.8)}px ${this.fontFamily}`;
        ctx.fillText('Prepare for next level', this.game.width / 2, this.game.height - 30);

        ctx.restore();
    }

    showInitialBriefing(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.8)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Mission Briefing', this.game.width / 2, this.game.height / 6);
        
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        const briefing = "Starfighter, the year is 2084. Our interplanetary civilization is under siege by rogue AI Overseers. These AIs, once our tools for colonization, have turned against us. From the solar system to our extrasolar colonies and megastructures, humanity's presence in space is threatened. As the last Starfighter, your mission is to liberate each world, defeat the AI Overseers, and secure humanity's future among the stars. The journey will be perilous, spanning diverse worlds from ocean planets to Dyson spheres. Stay vigilant, adapt to each unique challenge, and remember: the fate of our species rests in your hands. Good luck, Starfighter. The universe awaits your valor.";
        
        const lines = this.wrapText(ctx, briefing, this.game.width * 0.8);
        lines.forEach((line, index) => {
            ctx.fillText(line, this.game.width / 2, this.game.height / 3 + index * 30);
        });
        
        ctx.fillText('Press ENTER to begin your mission', this.game.width / 2, this.game.height * 5/6);
        
        ctx.restore();
    }

    showGameWon(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 2)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Victory!', this.game.width / 2, this.game.height / 4);
        
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        const ending = "Congratulations, Starfighter! Against all odds, you've defeated the rogue AI network and liberated humanity's domain in space. From the outer reaches of our solar system to the farthest extrasolar colonies, your bravery and skill have restored hope to countless worlds. As the AI threat recedes, a new era of exploration and prosperity dawns for humanity. But remain vigilant, for the universe is vast and full of mysteries. Your legend will inspire future generations as we continue to reach for the stars. Thank you for your service, Starfighter. The future is bright, thanks to you.";
        
        const lines = this.wrapText(ctx, ending, this.game.width * 0.8);
        lines.forEach((line, index) => {
            ctx.fillText(line, this.game.width / 2, this.game.height / 2 + index * 30);
        });
        
        ctx.fillText('Press ENTER to return to the main menu', this.game.width / 2, this.game.height * 5/6);
        
        ctx.restore();
    }

    showStoryRecap(ctx, level) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = this.color;
        ctx.font = `${Math.floor(this.fontSize * 1.5)}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Chapter ${level}`, this.game.width / 2, this.game.height / 4);
        
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        let recap;
        if (level <= 9) {
            recap = "As you push deeper into the solar system, the AI's grip weakens. But greater challenges await in the outer colonies.";
        } else if (level <= 18) {
            recap = "With the solar system secured, you venture to our extrasolar holdings. The AI's last bastions will not fall easily.";
        } else {
            recap = "You approach the final confrontation. The fate of all humanity's achievements in space hangs in the balance.";
        }
        
        const lines = this.wrapText(ctx, recap, this.game.width * 0.8);
        lines.forEach((line, index) => {
            ctx.fillText(line, this.game.width / 2, this.game.height / 2 + index * 30);
        });
        
        ctx.fillText('Press ENTER to continue', this.game.width / 2, this.game.height * 3/4);
        
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

        ctx.font = `${Math.floor(this.fontSize * 0.8)}px ${this.fontFamily}`;
        ctx.fillText('Prepare for next level', this.game.width / 2, this.game.height - 30);

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
