// audio.js

class GameAudio {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.isSoundMuted = false;
        this.isMusicMuted = false;
    }

    loadSounds() {
        const soundFiles = {
            explode: 'explode.m4a',
            laser: 'laser.m4a',
            hit: 'hit.m4a',
            thrust: 'thrust.m4a'
            // Remove the bosslaser sound from here
        };

        for (const [name, file] of Object.entries(soundFiles)) {
            this.sounds[name] = new window.Audio(`assets-sounds/${file}`);
            this.sounds[name].onerror = () => {
                console.warn(`Failed to load sound: ${file}`);
                delete this.sounds[name];
            };
        }

        this.music = new window.Audio('assets-sounds/gameplay_music.mp3');
        this.music.loop = true;
        this.music.onerror = () => {
            console.warn('Failed to load background music');
            this.music = null;
        };
    }

    playSound(name) {
        if (!this.isSoundMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(e => console.warn(`Error playing sound ${name}:`, e));
        }
    }

    startMusic() {
        if (!this.isMusicMuted) {
            this.music.play();
        }
    }

    stopMusic() {
        this.music.pause();
        this.music.currentTime = 0;
    }

    toggleSound() {
        this.isSoundMuted = !this.isSoundMuted;
    }

    toggleMusic() {
        this.isMusicMuted = !this.isMusicMuted;
        if (this.isMusicMuted) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }
}

export default GameAudio;