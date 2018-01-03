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
    static error(instance, error, message)
    {
        if (!error)
        {
            intel.getLogger('entoj.ErrorHandler').error('Error handler without error object', instance, error);
        }
        else
        {
            if (instance)
            {
                if (message)
                {
                    instance.logger.error(message);
                }
                instance.logger.error(typeof error.stack != 'undefined' ? error.stack : error);
            }
            else
            {
                if (message)
                {
                    intel.getLogger('entoj.ErrorHandler').error(message);
                }
                intel.getLogger('entoj.ErrorHandler').error(typeof error.stack != 'undefined' ? error.stack : error);
            }
        }
        throw error;
    }


    // Returns a bound error handler
    static handler(instance, message)
    {
        return function(error)
        {
            ErrorHandler.error(instance, error, message);
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ErrorHandler = ErrorHandler;
