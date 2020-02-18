'use strict';

/**
 * Requirements
 */
const MediaQueryFilter = require(ES_SOURCE + '/nunjucks/filter/MediaQueryFilter.js').MediaQueryFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(MediaQueryFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(MediaQueryFilter, 'nunjucks.filter/MediaQueryFilter', function(parameters)
    {
        return [global.fixtures.globalConfiguration];
    });


    /**
     * MediaQueryFilter Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#filter()', function()
    {
        xit('should return a empty string for a unknown breakpoint', function()
        {
            const testee = new MediaQueryFilter(global.fixtures.globalConfiguration).filter();
            expect(testee()).to.be.equal('');
            expect(testee({ hi: 'ho' })).to.be.equal('');
        });


        it('should return a media query for a breakpoint', function()
        {
            // This relies on the default breapoints of GlobalConfiguration
            const testee = new MediaQueryFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('mobile')).to.be.equal('(max-width: 375px)');
            expect(testee('tablet')).to.be.equal('(min-width: 1024px) and (max-width: 1024px)');
        });


        xit('should return a media query for a breakpoint AndAbove', function()
        {
            // This relies on the default breapoints of GlobalConfiguration
            const testee = new MediaQueryFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('mobileAndAbove')).to.be.equal('');
            expect(testee('tabletAndAbove')).to.be.equal('(min-width: 1024px)');
        });


        it('should return a media query for a breakpoint AndBelow', function()
        {
            // This relies on the default breapoints of GlobalConfiguration
            const testee = new MediaQueryFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('mobileAndBelow')).to.be.equal('(max-width: 375px)');
            expect(testee('tabletAndBelow')).to.be.equal('(max-width: 1024px)');
        });
    });
});
