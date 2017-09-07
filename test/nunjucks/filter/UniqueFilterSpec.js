'use strict';

/**
 * Requirements
 */
const UniqueFilter = require(ES_SOURCE + '/nunjucks/filter/UniqueFilter.js').UniqueFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(UniqueFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(UniqueFilter, 'nunjucks.filter/UniqueFilter');


    /**
     * UniqueFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a unique id', function()
        {
            const testee = new UniqueFilter().filter();
            expect(testee()).to.be.not.equal(testee());
        });
    });
});
