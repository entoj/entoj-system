'use strict';

/**
 * Requirements
 */
const EntityRenderer = require(ES_SOURCE + '/nunjucks/EntityRenderer.js').EntityRenderer;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 */
describe(EntityRenderer.className, function()
{
    /**
     * Base Test
     */
    baseSpec(EntityRenderer, 'nunjucks/EntityRenderer', function(parameters)
    {
        const environment = new Environment(global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration);
        return [global.fixtures.urlsConfiguration, global.fixtures.pathesConfiguration, environment];
    });


    /**
     * Environment Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });

    // Creates a initialized testee
    function createTestee(templatePaths)
    {
        const environment = new Environment(global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [
                new Filters.ModuleClassesFilter()
            ]);
        return new EntityRenderer(global.fixtures.urlsConfiguration, global.fixtures.pathesConfiguration, environment);
    }


    describe('#renderForUrl', function()
    {
        it('should render the template for a valid url', function()
        {
            const promise = co(function*()
            {
                const testee = createTestee();
                const source = yield testee.renderForUrl('base/elements/e-cta/examples/overview.j2');
                expect(source).to.be.ok;
            });
            return promise;
        });

        it('should resolve to false for a invalid url', function()
        {
            const promise = co(function*()
            {
                const testee = createTestee();
                const source = yield testee.renderForUrl('base/elements/e-cta/examples/missing.j2');
                expect(source).to.be.not.ok;
            });
            return promise;
        });

        it('should throw a exception when the template contains errors', function()
        {
            const promise = co(function*()
            {
                const testee = createTestee();
                let error;
                try
                {
                    yield testee.renderForUrl('base/elements/e-cta/examples/failure.j2');
                }
                catch(e)
                {
                    error = e;
                }
                expect(error).to.be.ok;
            });
            return promise;
        });
    });
});
