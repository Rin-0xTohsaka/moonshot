// utils/logger.js
// Logging utility

import { LOG_ALL, LOG_INFO, LOG_DEBUG, LOG_WARNING, LOG_ERROR, LOG_CRITICAL } from '../config/gameConfig.js';

export function createLogger(game) {
    return {
        info: function(msg) {
            if (game.log_level <= LOG_INFO)
                console.log('[INFO]', msg);
        },
        debug: function(msg) {
            if (game.log_level <= LOG_DEBUG)
                console.log('[DEBUG]', msg);
        },
        warning: function(msg) {
            if (game.log_level <= LOG_WARNING)
                console.warn('[WARNING]', msg);
        },
        error: function(msg) {
            if (game.log_level <= LOG_ERROR)
                console.error('[ERROR]', msg);
        },
        critical: function(msg) {
            if (game.log_level <= LOG_CRITICAL)
                console.error('[CRITICAL]', msg);
        }
    };
}