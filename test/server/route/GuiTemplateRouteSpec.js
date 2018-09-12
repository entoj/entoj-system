'use strict';

/**
 * Requirements
 */
const GuiTemplateRoute = require(ES_SOURCE + '/server/route/GuiTemplateRoute.js').GuiTemplateRoute;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const routeSpec = require('./RouteShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

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
});
