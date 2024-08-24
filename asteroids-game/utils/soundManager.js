// utils/soundManager.js
// Manages sound effects and background music

export function createSoundManager() {
    const sounds = {
        laser: new Audio('assets-sounds/laser.m4a'),
        explode: new Audio('assets-sounds/explode.m4a'),
        hit: new Audio('assets-sounds/hit.m4a'),
        thrust: new Audio('assets-sounds/thrust.m4a'),
        musicHigh: new Audio('assets-sounds/music-high.m4a'),
        musicLow: new Audio('assets-sounds/music-low.m4a'),
        backgroundMusic: new Audio('assets-sounds/gameplay_music.mp3') // Replace with your file name
    };

    sounds.backgroundMusic.loop = true; // Set background music to loop

    let soundEffectsEnabled = true;
    let musicEnabled = true;

    return {
        play: function(sound) {
            if (soundEffectsEnabled && sounds[sound]) {
                sounds[sound].currentTime = 0; // Reset the sound to start if it's already playing
                sounds[sound].play();
            } else {
                console.warn(`Sound ${sound} not found or sound effects are disabled.`);
            }
        },
        stop: function(sound) {
            if (sounds[sound]) {
                sounds[sound].pause();
                sounds[sound].currentTime = 0;
            }
        },
        loop: function(sound) {
            if (sounds[sound]) {
                sounds[sound].loop = true;
                sounds[sound].play();
            }
        },
        startBackgroundMusic: function() {
            if (musicEnabled) {
                this.loop('backgroundMusic');
            }
        },
        stopBackgroundMusic: function() {
            this.stop('backgroundMusic');
        },
        toggleSoundEffects: function() {
            soundEffectsEnabled = !soundEffectsEnabled;
        },
        toggleMusic: function() {
            musicEnabled = !musicEnabled;
            if (musicEnabled) {
                this.startBackgroundMusic();
            } else {
                this.stopBackgroundMusic();
            }
        },
        areSoundEffectsEnabled: function() {
            return soundEffectsEnabled;
        },
        isMusicEnabled: function() {
            return musicEnabled;
        }
    };
}