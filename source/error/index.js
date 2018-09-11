/**
 * @namespace error
 */
module.exports = {
    ErrorHandler: require('./ErrorHandler.js').ErrorHandler,
    MissingArgumentError: require('./MissingArgumentError.js').MissingArgumentError,
    MissingConfigurationError: require('./MissingConfigurationError.js').MissingConfigurationError
};
