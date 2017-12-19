'use strict';

/**
 * Creates the application base config
 */
function configure(options, localConfiguration)
{
    const Configuration = require('./application/Configuration.js').Configuration;
    return new Configuration(options, localConfiguration);
}


/**
 * Sets the log level of the internal intel logger
 */
function setLogLevel(level)
{
    const intel = require('intel');
    const logger = intel.getLogger('entoj');
    logger.setLevel(level);
}


/**
 * API
 */
module.exports =
{
    Base: require('./Base.js').Base,
    application: require('./application/index.js'),
    base: require('./base/index.js'),
    cli: require('./cli/index.js'),
    command: require('./command/index.js'),
    configure: configure,
    error: require('./error/index.js'),
    export: require('./export/index.js'),
    formatter: require('./formatter/index.js'),
    linter: require('./linter/index.js'),
    model: require('./model/index.js'),
    nunjucks: require('./nunjucks/index.js'),
    parser: require('./parser/index.js'),
    server: require('./server/index.js'),
    setLogLevel: setLogLevel,
    task: require('./task/index.js'),
    utils: require('./utils/index.js'),
    watch: require('./watch/index.js')
};
