'use strict';

/**
 * Requirements
 */
const FormatDateFilter = require(ES_SOURCE + '/nunjucks/filter/FormatDateFilter.js').FormatDateFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const moment = require('moment');


/**
 * Spec
 */
describe(FormatDateFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(FormatDateFilter, 'nunjucks.filter/FormatDateFilter', function(parameters)
    {
        return [global.fixtures.globalConfiguration];
    });


    /**
     * FormatDateFilter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#filter()', function()
    {
        it('should return the current date in the form YYYY-MM-DD when no date given', function()
        {
            const testee = new FormatDateFilter(global.fixtures.globalConfiguration).filter();
            expect(testee()).to.be.equal(moment().format('YYYY-MM-DD'));
        });

        it('should return the given date in the form YYYY-MM-DD when no format given', function()
        {
            const testee = new FormatDateFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('1995-12-25')).to.be.equal(moment('1995-12-25').format('YYYY-MM-DD'));
        });

        it('should allow to specify the format', function()
        {
            const testee = new FormatDateFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('2013-02-08 09:30:26', 'DD-MM-YY')).to.be.equal(moment('2013-02-08 09:30:26').format('DD-MM-YY'));
        });

        it('should allow to override the format via buildConfiguration filters.formatDate', function()
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
                                formatDate: 'DD-MM-YY'
                            }
                        }
                    }
                }
            };
            const fixture = projectFixture.createStatic(options);
            const environment = new Environment(fixture.entitiesRepository, fixture.pathesConfiguration, fixture.buildConfiguration);
            const filter = new FormatDateFilter(global.fixtures.globalConfiguration);
            filter.register(environment);
            const testee = filter.filter();
            expect(testee('2013-02-08 09:30:26')).to.be.equal(moment('2013-02-08 09:30:26').format('DD-MM-YY'));
        });
    });
});
