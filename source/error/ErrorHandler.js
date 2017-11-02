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
        if (!error)
        {
            intel.getLogger('entoj.ErrorHandler').error('Error handler without error object', instance, error);
        }
        else
        {
            if (instance)
            {
                instance.logger.error(typeof error.stack != 'undefined' ? error.stack : error);
            }
            else
            {
                intel.getLogger('entoj.ErrorHandler').error(typeof error.stack != 'undefined' ? error.stack : error);
            }
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
