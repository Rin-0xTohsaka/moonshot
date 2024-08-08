// gameConfig.js
// Game-wide settings

export const GAME_HEIGHT = 480;
export const GAME_WIDTH = 640;
export const FRAME_PERIOD = 60; // 1 frame / x frames/sec
export const LEVEL_TIMEOUT = 2000; // How long to wait after clearing a level.

// Logging levels
export const LOG_ALL = 0;
export const LOG_INFO = 1;
export const LOG_DEBUG = 2;
export const LOG_WARNING = 3;
export const LOG_ERROR = 4;
export const LOG_CRITICAL = 5;
export const LOG_NONE = 6;

// Default log level
export const DEFAULT_LOG_LEVEL = LOG_DEBUG;

// Points settings
export const POINTS_TO_EXTRA_LIFE = 1000; // How many points to get a 1-up?

// Key codes
export const LEFT = 37;
export const UP = 38;
export const RIGHT = 39;
export const DOWN = 40;
export const FIRE = 32;

// Player settings
export const THRUST_ACCEL = 1;
export const ROTATE_SPEED = Math.PI / 10; // How fast do players turn? (radians)

// Bullet settings
export const MAX_BULLETS = 3;
export const MAX_BULLET_AGE = 25;

// Asteroid settings
export const ASTEROID_CHILDREN = 2; // How many does each death create?
export const ASTEROID_SCORE = 10; // How many points is each one worth?