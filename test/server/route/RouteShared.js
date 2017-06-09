'use strict';

/**
 * Requirements
 * @ignore
 */
const Server = require(ES_SOURCE + '/server/Server.js').Server;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Shared Route spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Route Helpers
     */

    // stop a running server after any test
    afterEach(function(done)
    {
        if (global.fixtures.server)
        {
            global.fixtures.server.stop().then(() => done());
        }
        else
        {
            done();
        }
    });

    // Create a initialized server
    spec.createServer = function(routes)
    {
        const cliLogger = new CliLogger('', { muted: true });
        global.fixtures.server = new Server(cliLogger, routes);
    };
}

/**
 * Exports
 */
module.exports.spec = spec;
