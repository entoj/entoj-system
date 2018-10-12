'use strict';

/**
 * Requirements
 */
const StaticRoute = require(ES_SOURCE + '/server/route/StaticRoute.js').StaticRoute;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const routeSpec = require('./RouteShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const testFixture = require('entoj-test-fixture');
const request = require('supertest');

/**
 * Spec
 */
describe(StaticRoute.className, function() {
    /**
     * Route Test
     */
    routeSpec(StaticRoute, 'server.route/StaticRoute', function(parameters) {
        return [
            global.fixtures.cliLogger,
            global.fixtures.pathesConfiguration,
            global.fixtures.moduleConfiguration
        ];
    });

    /**
     * StaticRoute Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    // Create a initialized testee
    const createTestee = function(allowedExtensions, staticPaths, staticHandlers) {
        const cliLogger = new CliLogger('', { muted: true });
        return new StaticRoute(
            cliLogger,
            global.fixtures.pathesConfiguration,
            global.fixtures.moduleConfiguration,
            allowedExtensions,
            staticPaths || testFixture.pathToSites,
            staticHandlers || [{ route: '/*' }]
        );
    };

    describe('serving...', function() {
        it('should serve static files from a given directory', function(done) {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/base/global/assets/css/examples.css')
                    .expect(200, done);
            });
        });

        it('should only serve known file extensions', function(done) {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/base/elements/e-cta/e-cta.md')
                    .expect(404, done);
            });
        });

        it('should allow to configure extensions', function(done) {
            const testee = createTestee(['.md']);
            routeSpec.createServer([testee]);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/base/elements/e-cta/e-cta.md')
                    .expect(200, done);
            });
        });

        it('should return a 404 if file does not exist', function(done) {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/base/global/assets/css/exampl.css')
                    .expect(404, done);
            });
        });

        it('should allow to require authentication for a route', function(done) {
            const testee = createTestee(false, false, [{ route: '/*', authenticate: true }]);
            routeSpec.createServer([testee], { system: { server: { authentication: true } } });
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/base/global/assets/css/examples.css')
                    .expect(401, done);
            });
        });
    });
});
