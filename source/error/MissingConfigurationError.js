'use strict';

/**
 * @memberOf error
 * @extends Error
 */
class MissingConfigurationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingConfigurationError';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.MissingConfigurationError = MissingConfigurationError;
