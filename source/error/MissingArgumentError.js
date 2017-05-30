'use strict';

/**
 * @memberOf error
 * @extends Error
 */
class MissingArgumentError extends Error
{
    constructor(message)
    {
        super(message);
        this.name = 'MissingArgumentError';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.MissingArgumentError = MissingArgumentError;
