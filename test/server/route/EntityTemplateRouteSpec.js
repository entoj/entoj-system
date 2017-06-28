'use strict';

/**
 * Requirements
 */
const EntityTemplateRoute = require(ES_SOURCE + '/server/route/EntityTemplateRoute.js').EntityTemplateRoute;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const Plugins = require(ES_SOURCE + '/model/viewmodel/plugin/index.js');
const routeSpec = require('./RouteShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const request = require('supertest');


/**
 * Spec
 */
describe(EntityTemplateRoute.className, function()
{
    /**
     * Route Test
     */
    routeSpec(EntityTemplateRoute, 'server.route/EntityTemplateRoute', function(parameters)
    {
        const cliLogger = new CliLogger('', { muted: true });
        return [cliLogger, global.fixtures.urlsConfiguration, global.fixtures.nunjucks];
    });


    /**
     * EntityTemplateRoute Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
        global.fixtures.viewModelRepository.plugins.push(new Plugins.ViewModelLipsumPlugin());
        global.fixtures.viewModelRepository.plugins.push(new Plugins.ViewModelImagePlugin());
        global.fixtures.viewModelRepository.plugins.push(new Plugins.ViewModelImportPlugin());
        global.fixtures.nunjucks = new Environment(global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [
                new Filters.LoadFilter(global.fixtures.viewModelRepository),
                new Filters.ImageUrlFilter(['image']),
                new Filters.ModuleClassesFilter(),
                new Filters.EmptyFilter(),
                new Filters.NotEmptyFilter(),
                new Filters.MediaQueryFilter(global.fixtures.globalConfiguration)
            ],
            { basePath: global.fixtures.pathesConfiguration.sites });
    });


    // Create a initialized testee
    const createTestee = function()
    {
        const cliLogger = new CliLogger('', { muted: true });
        return new EntityTemplateRoute(cliLogger,
            global.fixtures.urlsConfiguration,
            global.fixtures.nunjucks,
            { basePath: global.fixtures.pathesConfiguration.sites });
    };


    describe('serving...', function()
    {
        it('should serve .j2 files from a entity directory', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/pages/p-start/p-start.j2')
                    .expect(200)
                    .expect(/m-teaser/m)
                    .expect(/e-headline/m)
                    .expect(/g-teaserlist/m, done);
            });
        });

        it('should only serve .j2 files', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/pages/p-start/p-start.md')
                    .expect(404, done);
            });
        });

        it('should only serve existing files', function(done)
        {
            const testee = createTestee();
            routeSpec.createServer([testee]);
            global.fixtures.server.addRoute(testee);
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/base/pages/p-start/p-start-msiing.j2')
                    .expect(404, done);
            });
        });
    });
});
