'use strict';

/**
 * Requirements
 */
const NotEmptyFilter = require(ES_SOURCE + '/nunjucks/filter/NotEmptyFilter.js').NotEmptyFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(NotEmptyFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(NotEmptyFilter, 'nunjucks.filter/NotEmptyFilter');


    /**
     * NotEmptyFilter Test
     */
    function testFixture(name, value, expected)
    {
        it(name, function()
        {
            const testee = new NotEmptyFilter().filter();
            const values = Array.isArray(value)
                ? value
                : [value];
            for (const v of values)
            {
                expect(testee(v)).to.be.equal(expected);
            }
        });
    }

    describe('#filter()', function()
    {
        testFixture('should return false for undefined, false, null', [undefined, false, null], false);
        testFixture('should return false for a empty String', '', false);
        testFixture('should return false for a empty Array', [], false);
        testFixture('should return false for a empty Map', new Map(), false);
        testFixture('should return false for a empty Object', {}, false);
        testFixture('should return true for everything else', [true, 'Hi', 0, 1, [1], { 'Hi': 42 }], true);
    });
});
