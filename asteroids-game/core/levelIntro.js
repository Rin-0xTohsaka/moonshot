// core/levelIntro.js

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export function createLevelIntro(game) {
    const planetImages = {
        Pluto: 'assets/planets/pluto.png',
        Neptune: 'assets/planets/neptune.png',
        Uranus: 'assets/planets/uranus.png',
        Saturn: 'assets/planets/saturn.png',
        Jupiter: 'assets/planets/jupiter.png',
        Mars: 'assets/planets/mars.png',
        Venus: 'assets/planets/venus.png',
        Mercury: 'assets/planets/mercury.png',
        Earth: 'assets/planets/earth.png'
    };

    function showIntro(level, objective, callback) {
        console.log('showIntro called for level:', level.name);
        const ctx = game.playfield.getContext('2d');
        const planetImage = new Image();
        planetImage.src = planetImages[level.name];
    
        planetImage.onload = () => {
            console.log('Planet image loaded for', level.name);
            drawIntro();  // Start drawing only after image is loaded
        };
    
        let textY = GAME_HEIGHT * 0.65;
        let text = `Level: ${level.name}\nMission: ${objective}\n\nGood luck, cadet!`;
        let displayedText = '';
        let charIndex = 0;
    
        function drawIntro() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
            // Draw planet
            const size = Math.min(GAME_WIDTH, GAME_HEIGHT) * 0.3;
            ctx.drawImage(planetImage, GAME_WIDTH / 2 - size / 2, GAME_HEIGHT * 0.2, size, size);
    
            // Draw text box
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(GAME_WIDTH * 0.1, textY - 20, GAME_WIDTH * 0.8, GAME_HEIGHT * 0.3);
    
            // Draw text
            ctx.font = '16px "Press Start 2P", monospace';
            ctx.fillStyle = 'white';
            let lines = displayedText.split('\n');
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], GAME_WIDTH * 0.15, textY + i * 25);
            }
    
            // Typewriter effect
            if (charIndex < text.length) {
                displayedText += text[charIndex];
                charIndex++;
                requestAnimationFrame(drawIntro);
            } else {
                // Auto-start after countdown
                let countdown = 5;  // 3 seconds countdown
                const countdownInterval = setInterval(() => {
                    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                    ctx.drawImage(planetImage, GAME_WIDTH / 2 - size / 2, GAME_HEIGHT * 0.2, size, size);

                    ctx.fillStyle = 'white';
                    ctx.font = '20px "Press Start 2P", monospace';
                    ctx.fillText(`Starting in ${countdown}...`, GAME_WIDTH / 2, textY + lines.length * 25 + 30);
                    
                    countdown--;

                    if (countdown < 0) {
                        clearInterval(countdownInterval);
                        console.log('Countdown complete, starting game...');
                        callback();
                    }
                }, 1000);
            }
        }
    }

    return { showIntro };
}
