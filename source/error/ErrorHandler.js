'use strict';

/**
 * @memberOf error
 */
class ErrorHandler
{
    static error(instance, error)
    {
        instance.logger.error(error.stack);
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
