'use strict';

/**
 * Requirements
 */
const intel = require('intel');


/**
 * @memberOf error
 */
class ErrorHandler
{
    static error(instance, error)
    {
        if (instance)
        {
            instance.logger.error(error.stack);
        }
        else
        {
            intel.getLogger('entoj.ErrorHandler').error(error.stack);
        }
        throw error;
    }


    // Returns a bound error handler
    static handler(instance)
    {
        return function(error)
        {
            ErrorHandler.error(instance, error);
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ErrorHandler = ErrorHandler;
