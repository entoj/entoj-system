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
    const createTestee = function(args)
    {
        args = args || {};
        const fixture = projectFixture.createDynamic();
        const params = [];
        params.push(fixture.entitiesRepository);
        params.push(baseSpec.defaultValue(args.basePath, fixture.pathesConfiguration.sites));
        params.push(args.environment);
        return new Template(...params);
    };


    /**
     * Base Test
     */
    baseSpec(Template, 'nunjucks/Template', createTestee);


    /**
     * Template Test
     */

    // Properties
    baseSpec.assertProperty(createTestee({ basePath: false }), ['basePath'], 'foo', '');


    describe('#getInclude', function()
    {
        it('should return false for a non existing macro', function()
        {
            const testee = createTestee();
            const include = testee.getInclude('m002_gallery');
            expect(include).to.be.not.ok;
        });

        it('should return a jinja import for a existing macro', function()
        {
            const testee = createTestee();
            const include = testee.getInclude('m_teaser');
            expect(include).to.be.equal('{% from "/base/modules/m-teaser/m-teaser.j2" import m_teaser %}');
        });
    });


    describe('#prepare', function()
    {
        it('should add all necessary includes', function()
        {
            const testee = createTestee();
            const input = '{{ e_cta() }}';
            const source = testee.prepare(input);
            expect(source).to.include('{% from "/base/elements/e-cta/e-cta.j2" import e_cta %}');
        });

        it('should not create cyclic dependencies', function()
        {
            const testee = createTestee();
            const input = '{% macro e_headline() %}{% endmacro %}{{ m_teaser() }}{{ e_headline() }}';
            const source = testee.prepare(input);
            expect(source).to.include('{% from "/base/modules/m-teaser/m-teaser.j2" import m_teaser %}');
            expect(source).to.not.include('{% from "/base/elements/e-headline/e-headline.j2" import e_headline %}');
        });

        it('should support environments', function()
        {
            const testee = createTestee({ environment: 'development' });
            const input = 'All{# +environment: development #}-Development{# -environment #}';
            expect(testee.prepare(input)).to.be.equal('All-Development');
        });
    });
});
