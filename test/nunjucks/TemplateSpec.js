'use strict';

/**
 * Requirements
 */
const Template = require(ES_SOURCE + '/nunjucks/Template.js').Template;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(Template.className, function()
{
    /**
     * Base Test
     */
    baseSpec(Template, 'nunjucks/Template', function(parameters)
    {
        const fixture = projectFixture.createStatic();
        parameters.unshift(fixture.entitiesRepository);
        return parameters;
    });


    /**
     * Template Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });


    // Creates a initialized testee
    function createTestee(basePath, environment)
    {
        return new Template(global.fixtures.entitiesRepository, basePath, environment);
    }


    // Properties
    baseSpec.assertProperty(createTestee(), ['basePath'], 'foo', '');


    describe('#getInclude', function()
    {
        it('should return false for a non existing macro', function()
        {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const include = testee.getInclude('m002_gallery');
            expect(include).to.be.not.ok;
        });

        it('should return a jinja import for a existing macro', function()
        {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const include = testee.getInclude('m_teaser');
            expect(include).to.be.equal('{% from "/base/modules/m-teaser/m-teaser.j2" import m_teaser %}');
        });
    });


    describe('#prepare', function()
    {
        it('should add all necessary includes', function()
        {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const input = '{{ e_cta() }}';
            const source = testee.prepare(input);
            expect(source).to.include('{% from "/base/elements/e-cta/e-cta.j2" import e_cta %}');
        });

        it('should not create cyclic dependencies', function()
        {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const input = '{% macro e_headline() %}{% endmacro %}{{ m_teaser() }}{{ e_headline() }}';
            const source = testee.prepare(input);
            expect(source).to.include('{% from "/base/modules/m-teaser/m-teaser.j2" import m_teaser %}');
            expect(source).to.not.include('{% from "/base/elements/e-headline/e-headline.j2" import e_headline %}');
        });

        it('should support environments', function()
        {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites, 'development');
            const input = 'All{# +environment: development #}-Development{# -environment #}';
            expect(testee.prepare(input)).to.be.equal('All-Development');
        });
    });
});
