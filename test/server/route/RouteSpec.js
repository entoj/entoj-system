'use strict';

/**
 * Requirements
 */
const Route = require(ES_SOURCE + '/server/route/Route.js').Route;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const routeSpec = require('./RouteShared.js').spec;
const testFixture = require('entoj-test-fixture');
const request = require('supertest');


/**
 * Spec
 */
describe(Route.className, function()
{
    /**
     * Route Test
     */
    routeSpec(Route, 'server.route/Route', function(parameters)
    {
        const cliLogger = new CliLogger('', { muted: true });
        return [cliLogger];
    });


    /**
     * Route Test
     */
    beforeEach(function()
    {
        global.fixtures = {};
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
    });


    // Create a initialized testee
    const createTestee = function()
    {
        const cliLogger = new CliLogger('', { muted: true });
        return new Route(cliLogger);
    };


    describe('#addStaticFileHandler', function()
    {
        it('should allow to serve files from a directory', function(done)
        {
            routeSpec.createServer();
            const testee = createTestee();
            global.fixtures.server.addRoute(testee);
            testee.addStaticFileHandler('*', testFixture.pathToSites);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/global/js/base.js')
                    .expect(200, done);
            });
        });

        it('should allow only serve known file extensions', function(done)
        {
            routeSpec.createServer();
            const testee = createTestee();
            global.fixtures.server.addRoute(testee);
            testee.addStaticFileHandler('*', testFixture.pathToSites, ['.md']);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/global/js/base.js')
                    .expect(404, done);
            });
        });
    });
});
