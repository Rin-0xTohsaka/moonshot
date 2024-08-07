// playerConfig.js
// Player-specific settings

export const ROTATE_SPEED = Math.PI/10; // How fast do players turn? (radians)
export const MAX_SPEED = 15; // Maximum player speed
export const THRUST_ACCEL = 1;
export const DEATH_TIMEOUT = 2000; // milliseconds
export const INVINCIBLE_TIMEOUT = 1500; // How long to stay invincible after resurrecting?
export const PLAYER_LIVES = 3;
export const POINTS_PER_SHOT = 1; // How many points does a shot cost? (Should be >= 0.)

// Remove or comment out PLAYER_PATH as we won't be using it anymore
// export const PLAYER_PATH = [
//     [10, 0],
//     [-5, 5],
//     [-5, -5],
//     [10, 0],
// ];

export const PLAYER_RADIUS = 20; // Adjust this based on the size of your image
export const PLAYER_IMAGE_PATH = 'assets/ships/pixel_ship.png';