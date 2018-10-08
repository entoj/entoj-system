'use strict';

/**
 * Requirements
 * @ignore
 */
const Server = require(ES_SOURCE + '/server/Server.js').Server;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Shared Route spec
 */
function spec(type, className, prepareParameters) {
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * Route Helpers
     */

    // stop a running server after any test
    afterEach(function(done) {
        if (global.fixtures.server) {
            global.fixtures.server.stop().then(() => done());
        } else {
            done();
        }
    });

    // Create a initialized server
    spec.createServer = function(routes, configuration) {
        const cliLogger = new CliLogger('', { muted: true });
        global.fixtures.moduleConfiguration = new SystemModuleConfiguration(
            new GlobalConfiguration(configuration),
            new BuildConfiguration()
        );
        global.fixtures.server = new Server(cliLogger, global.fixtures.moduleConfiguration, routes);
    };

    // create a testee
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    /**
     * Route Tests
     */
    describe('#register', function() {
        it('should return a promise', function() {
            const testee = createTestee();
            expect(testee.register()).to.be.instanceof(Promise);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
