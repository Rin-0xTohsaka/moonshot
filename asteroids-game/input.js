// input.js

class Input {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.touchStartX = 0;
    }

    setupListeners() {
        window.addEventListener('keydown', e => this.handleKeyDown(e));
        window.addEventListener('keyup', e => this.handleKeyUp(e));

        if (this.game.isMobile) {
            this.setupTouchListeners();
        } else {
            this.game.canvas.addEventListener('click', this.handleClick.bind(this));
        }
    }

    setupTouchListeners() {
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const shootBtn = document.getElementById('shootBtn');

        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys.ArrowLeft = true;
        });
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.ArrowLeft = false;
        });
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys.ArrowRight = true;
        });
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.ArrowRight = false;
        });
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys.Space = true;
        });
        shootBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.Space = false;
        });
    }

    handleTouch(e, isDown) {
        e.preventDefault();
        const touch = e.touches[0];
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (y > canvas.height * 0.8) {
            if (x < canvas.width / 3) {
                this.keys.ArrowLeft = isDown;
            } else if (x > canvas.width * 2 / 3) {
                this.keys.ArrowRight = isDown;
            } else {
                this.keys.Space = isDown;
            }
        }
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;
        // console.log(`Key pressed: ${e.code}`); // Add this line
        if (e.code === 'KeyG') {
            this.toggleGodMode();
        }
        if (e.code === 'Enter') {
            this.handleEnterKey();
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
        if (e.code === 'KeyM') {
            this.game.audio.toggleMute();
        }
    }

    handleClick(event) {
        const rect = this.game.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is on sound toggle button
        if (x >= 20 && x <= 120 && y >= this.game.height - 60 && y <= this.game.height - 40) {
            this.game.audio.toggleSound();
        }

        // Check if click is on music toggle button
        if (x >= 20 && x <= 120 && y >= this.game.height - 30 && y <= this.game.height - 10) {
            this.game.audio.toggleMusic();
        }
    }

    handleEnterKey() {
        if (this.game.gameState === 'menu') {
            this.game.startGame();
        } else if (this.game.gameState === 'gameOver') {
            this.game.showMainMenu();
        }
    }

    toggleGodMode() {
        // Implement God mode functionality
        // console.log('God mode toggled');
    }
}

export default Input;