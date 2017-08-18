'use strict';

/**
 * Requirements
 */
const SvgViewBoxFilter = require(ES_SOURCE + '/nunjucks/filter/SvgViewBoxFilter.js').SvgViewBoxFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(SvgViewBoxFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(SvgViewBoxFilter, 'nunjucks.filter/SvgViewBoxFilter', function(parameters)
    {
        return [global.fixtures.pathesConfiguration];
    });


    /**
     * SvgViewBoxFilter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#filter()', function()
    {
        it('should return the default viewbox 0 0 0 0 for a non existing svg', function()
        {
            const testee = new SvgViewBoxFilter(global.fixtures.pathesConfiguration, '/base/global/assets/svg').filter();
            expect(testee('error')).to.be.equal('0 0 0 0');
        });

        it('should return the viewbox of a existing svg', function()
        {
            const testee = new SvgViewBoxFilter(global.fixtures.pathesConfiguration, '/base/global/assets/svg').filter();
            expect(testee('arrow')).to.be.equal('0 0 82.42 154.57');
        });
    });
});
