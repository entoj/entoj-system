'use strict';

/**
 * Requirements
 */
const FormatNumberFilter = require(ES_SOURCE + '/nunjucks/filter/FormatNumberFilter.js').FormatNumberFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;


/**
 * Spec
 */
describe(FormatNumberFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(FormatNumberFilter, 'nunjucks.filter/FormatNumberFilter', function(parameters)
    {
        return [global.fixtures.globalConfiguration];
    });


    /**
     * FormatNumberFilter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#filter()', function()
    {
        it('should return the given number in the form 0.000 when no format given', function()
        {
            const testee = new FormatNumberFilter(global.fixtures.globalConfiguration).filter();
            expect(testee(42.123456789)).to.be.equal('42.123');
        });

        it('should allow to specify the format', function()
        {
            const testee = new FormatNumberFilter(global.fixtures.globalConfiguration).filter();
            expect(testee(42.123456789, '0.0')).to.be.equal('42.1');
        });

        it('should allow to override the format via buildConfiguration filters.formatNumber', function()
        {
            const options =
            {
                build:
                {
                    default: 'development',
                    environments:
                    {
                        development:
                        {
                            filters:
                            {
                                formatNumber: '0.0'
                            }
                        }
                    }
                }
            };
            const fixture = projectFixture.createStatic(options);
            const environment = new Environment(fixture.entitiesRepository, fixture.pathesConfiguration, fixture.buildConfiguration);
            const filter = new FormatNumberFilter(global.fixtures.globalConfiguration);
            filter.register(environment);
            const testee = filter.filter();
            expect(testee(42.123456789)).to.be.equal('42.1');
        });
    });
});
