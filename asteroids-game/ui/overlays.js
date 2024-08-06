// ui/overlays.js
// Overlay handling (including stars and scanlines)

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export function createOverlays() {
    const overlays = [];

    // Add scanline effect
    overlays.push(createScanlines());

    return {
        draw: function(ctx) {
            for (let i = 0; i < overlays.length; i++) {
                overlays[i].draw(ctx);
            }
        },
        add: function(obj) {
            if (overlays.indexOf(obj) === -1 && typeof obj.draw === 'function') {
                overlays.push(obj);
                return true;
            }
            return false;
        },
        remove: function(obj) {
            const index = overlays.indexOf(obj);
            if (index !== -1) {
                overlays.splice(index, 1);
                return true;
            }
            return false;
        }
    };
}

export function createStars() {
    const stars = [];
    for (let i = 0; i < 50; i++) {
        stars.push([Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT]);
    }

    return {
        draw: function(ctx) {
            ctx.fillStyle = 'white';
            for (let i = 0; i < stars.length; i++) {
                ctx.fillRect(stars[i][0], stars[i][1], 1, 1);
            }
        }
    };
}

function createScanlines() {
    return {
        draw: function(ctx) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            for (let i = 0; i < GAME_HEIGHT; i += 2) {
                ctx.fillRect(0, i, GAME_WIDTH, 1);
            }
        }
    };
}