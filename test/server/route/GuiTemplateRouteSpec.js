'use strict';

/**
 * Requirements
 */
const GuiTemplateRoute = require(ES_SOURCE + '/server/route/GuiTemplateRoute.js').GuiTemplateRoute;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const routeSpec = require('./RouteShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const request = require('supertest');

/**
 * Spec
 */
describe(GuiTemplateRoute.className, function() {
    /**
     * Route Test
     */
    routeSpec(GuiTemplateRoute, 'server.route/GuiTemplateRoute', function(parameters) {
        return [
            global.fixtures.cliLogger,
            global.fixtures.sitesRepository,
            global.fixtures.entityCategoriesRepository,
            global.fixtures.entitiesRepository,
            global.fixtures.moduleConfiguration,
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            global.fixtures.nunjucks
        ];
    });

    /**
     * GuiTemplateRoute Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.nunjucks = new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [
                new Filters.LoadFilter(global.fixtures.viewModelRepository),
                new Filters.Filter({ name: 'imageUrl' }), // stub
                new Filters.ModuleClassesFilter(),
                new Filters.EmptyFilter(),
                new Filters.NotEmptyFilter(),
                new Filters.MediaQueryFilter(global.fixtures.moduleConfiguration)
            ],
            [],
            { templatePaths: global.fixtures.pathesConfiguration.sites }
        );
    });

    // Create a initialized testee
    const createTestee = function(routes, options) {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.nunjucks = new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [
                new Filters.LoadFilter(global.fixtures.viewModelRepository),
                new Filters.Filter({ name: 'imageUrl' }), // stub
                new Filters.ModuleClassesFilter(),
                new Filters.EmptyFilter(),
                new Filters.NotEmptyFilter(),
                new Filters.MediaQueryFilter(global.fixtures.moduleConfiguration)
            ],
            [],
            { templatePaths: global.fixtures.pathesConfiguration.sites }
        );
        return new GuiTemplateRoute(
            global.fixtures.cliLogger,
            global.fixtures.sitesRepository,
            global.fixtures.entityCategoriesRepository,
            global.fixtures.entitiesRepository,
            global.fixtures.moduleConfiguration,
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            global.fixtures.nunjucks,
            routes,
            options
        );
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), [
        'nunjucks',
        'sitesRepository',
        'entityCategoriesRepository',
        'entitiesRepository',
        'pathesConfiguration',
        'urlsConfiguration'
    ]);

    describe('serving...', function() {
        it('should return a 404 when no template was found', function(done) {
            const testee = createTestee(undefined, { templatePaths: ES_FIXTURES + '/gui/default' });
            testee.addTemplateHandler('/', '--sites.j2', true);
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/')
                    .expect(404, done);
            });
        });

        it('should serve .j2 files from a directory', function(done) {
            const testee = createTestee(undefined, { templatePaths: ES_FIXTURES + '/gui/default' });
            testee.addTemplateHandler('/', 'sites.j2', true);
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/')
                    .expect(200)
                    .expect(/Sites/m, done);
            });
        });

        it('should allow multiple template pathes', function(done) {
            const testee = createTestee([{ url: '/', template: 'index.j2' }], {
                templatePaths: [ES_FIXTURES + '/gui/default', ES_FIXTURES + '/gui/custom']
            });
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/')
                    .expect(200)
                    .expect(/Index/m, done);
            });
        });

        it('should allow multiple template routes via constructor', function(done) {
            const testee = createTestee(
                [{ url: '/', template: 'index.j2' }, { url: '/sites', template: 'sites.j2' }],
                { templatePaths: [ES_FIXTURES + '/gui/default'] }
            );
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/sites')
                    .expect(200)
                    .expect(/Sites/m, done);
            });
        });
    });
});
