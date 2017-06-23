'use strict';

/**
 * Requirements
 */
const StaticFileRoute = require(ES_SOURCE + '/server/route/StaticFileRoute.js').StaticFileRoute;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const routeSpec = require('./RouteShared.js').spec;
const testFixture = require('entoj-test-fixture');
const request = require('supertest');


/**
 * Spec
 */
describe(StaticFileRoute.className, function()
{
    /**
     * Route Test
     */
    routeSpec(StaticFileRoute, 'server.route/StaticFileRoute', function(parameters)
    {
        const cliLogger = new CliLogger('', { muted: true });
        return [cliLogger];
    });


    /**
     * StaticFileRoute Test
     */
    beforeEach(function()
    {
        global.fixtures = {};
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
    });


    // Create a initialized testee
    const createTestee = function(allowedExtensions)
    {
        const cliLogger = new CliLogger('', { muted: true });
        return new StaticFileRoute(cliLogger, { basePath: testFixture.pathToSites, allowedExtensions: allowedExtensions });
    };


    describe('serving...', function()
    {
        it('should serve static files from a given directory', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/global/assets/css/examples.css')
                    .expect(200, done);
            });
        });

        it('should only serve known file extensions', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/elements/e-cta/e-cta.md')
                    .expect(404, done);
            });
        });

        it('should allow to configure extensions', function(done)
        {
            const testee = createTestee(['.md']);
            routeSpec.createServer([testee]);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/elements/e-cta/e-cta.md')
                    .expect(200, done);
            });
        });

        it('should return a 404 if file does not exist', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/global/assets/css/exampl.css')
                    .expect(404, done);
            });
        });
    });
});
