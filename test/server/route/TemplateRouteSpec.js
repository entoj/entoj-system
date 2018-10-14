'use strict';

/**
 * Requirements
 */
const TemplateRoute = require(ES_SOURCE + '/server/route/TemplateRoute.js').TemplateRoute;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const TemplateRenderer = require(ES_SOURCE + '/nunjucks/TemplateRenderer.js').TemplateRenderer;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const Plugins = require(ES_SOURCE + '/model/viewmodel/plugin/index.js');
const routeSpec = require('./RouteShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const request = require('supertest');

/**
 * Spec
 */
describe(TemplateRoute.className, function() {
    /**
     * Route Test
     */
    routeSpec(TemplateRoute, 'server.route/TemplateRoute', function(parameters) {
        const cliLogger = new CliLogger('', { muted: true });
        const environment = new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [new Filters.ModuleClassesFilter()]
        );
        global.fixtures.templateRenderer = new TemplateRenderer(
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            environment
        );
        return [
            cliLogger,
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            global.fixtures.moduleConfigurations,
            global.fixtures.templateRenderer
        ];
    });

    /**
     * EntityTemplateRoute Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
        global.fixtures.viewModelRepository.plugins.push(new Plugins.ViewModelLipsumPlugin());
        global.fixtures.viewModelRepository.plugins.push(new Plugins.ViewModelImportPlugin());
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
        global.fixtures.templateRenderer = new TemplateRenderer(
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            global.fixtures.nunjucks
        );
    });

    // Create a initialized testee
    const createTestee = function(templatePaths, templateHandlers) {
        const cliLogger = new CliLogger('', { muted: true });
        return new TemplateRoute(
            cliLogger,
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            global.fixtures.moduleConfigurations,
            global.fixtures.templateRenderer,
            templatePaths,
            templateHandlers || [{ route: '${system.route.site}/*' }]
        );
    };

    describe('serving...', function() {
        describe('entities', function() {
            it('should serve .j2 files from a entity directory', function(done) {
                const testee = createTestee();
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/base/pages/p-start/p-start.j2')
                        .expect(200)
                        .expect(/m-teaser/m)
                        .expect(/e-headline/m)
                        .expect(/g-teaserlist/m, done);
                });
            });

            it('should only serve .j2 files', function(done) {
                const testee = createTestee();
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/base/pages/p-start/p-start.md')
                        .expect(404, done);
                });
            });

            it('should only serve existing files', function(done) {
                const testee = createTestee();
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/base/pages/p-start/p-start-msiing.j2')
                        .expect(404, done);
                });
            });
        });

        describe('templates', function() {
            it('should return a 404 when no template was found', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/', '--sites.j2');
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/')
                        .expect(404, done);
                });
            });

            it('should serve .j2 files from a directory', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/', 'sites.j2');
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/')
                        .expect(200)
                        .expect(/Sites/m, done);
                });
            });

            it('should skip invalid sites', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/:site/:entityCategory/:entityId', 'location.j2', true);
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/notexisting/modules/m-teaser')
                        .expect(404, done);
                });
            });

            it('should skip invalid entity categories', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/:site/:entityCategory/:entityId', 'location.j2', true);
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/base/nonexisting/m-teaser')
                        .expect(404, done);
                });
            });

            it('should skip invalid entities', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/:site/:entityCategory/:entityId', 'location.j2', true);
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/base/modules/nonexisting')
                        .expect(404, done);
                });
            });

            it('should populate the location with site, entityCategory and entity', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/:site/:entityCategory/:entityId', 'location.j2');
                routeSpec.createServer([testee]);
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/base/modules/m-teaser')
                        .expect(200)
                        .expect(/Site: Base/m)
                        .expect(/EntityCategory: Module/m)
                        .expect(/Entity: \/base\/modules\/m-teaser/m, done);
                });
            });

            it('should allow to require authentication', function(done) {
                const testee = createTestee(ES_FIXTURES + '/gui/default');
                testee.addTemplateHandler('/', 'sites.j2', true);
                routeSpec.createServer([testee], { system: { server: { authentication: true } } });
                global.fixtures.server.addRoute(testee);
                global.fixtures.server.start().then(function(server) {
                    request(server)
                        .get('/')
                        .expect(401, done);
                });
            });

            it('should allow multiple template pathes', function(done) {
                const testee = createTestee([
                    ES_FIXTURES + '/gui/default',
                    ES_FIXTURES + '/gui/custom'
                ]);
                testee.addTemplateHandler('/', 'index.j2', true);
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
                const testee = createTestee(ES_FIXTURES + '/gui/default', [
                    { route: '/', template: 'index.j2' },
                    { route: '/sites', template: 'sites.j2' }
                ]);
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
});
