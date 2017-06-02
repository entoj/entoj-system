'use strict';

/**
 * Requirements
 */
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(Environment.className, function()
{
    /**
     * Base Test
     */
    baseSpec(Environment, 'nunjucks/Environment', function(parameters)
    {
        const fixture = projectFixture.createStatic();
        return [fixture.entitiesRepository, fixture.buildConfiguration];
    });


    /**
     * Environment Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });

    // Creates a initialized testee
    function createTestee(basePath)
    {
        return new Environment(global.fixtures.entitiesRepository,
            global.fixtures.buildConfiguration,
            undefined,
            { basePath: basePath });
    }


    // Properties
    baseSpec.assertProperty(createTestee(), ['basePath'], 'foo', '');


    describe('#renderString', function()
    {
        it('should add all necessary includes to render a template', function()
        {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const input = '{{ e_cta() }}';
            const source = testee.renderString(input);
            expect(source).to.include('<a class="e-cta');
        });
    });
});
