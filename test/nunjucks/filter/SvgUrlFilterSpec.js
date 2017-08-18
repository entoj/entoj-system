'use strict';

/**
 * Requirements
 */
const SvgUrlFilter = require(ES_SOURCE + '/nunjucks/filter/SvgUrlFilter.js').SvgUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(SvgUrlFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(SvgUrlFilter, 'nunjucks.filter/SvgUrlFilter');


    /**
     * SettingFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a svg sprite path', function()
        {
            const testee = new SvgUrlFilter().filter();
            expect(testee('arrow')).to.be.equal('/arrow.svg#icon');
        });

        it('should allow to configure the svg base path', function()
        {
            const testee = new SvgUrlFilter('/path/to/svg').filter();
            expect(testee('arrow')).to.be.equal('/path/to/svg/arrow.svg#icon');
        });
    });
});
