'use strict';

/**
 * Requirements
 */
const EmptyFilter = require(ES_SOURCE + '/nunjucks/filter/EmptyFilter.js').EmptyFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(EmptyFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(EmptyFilter, 'nunjucks.filter/EmptyFilter');


    /**
     * EmptyFilter Test
     */
    function testFixture(name, value, expected)
    {
        it(name, function()
        {
            const testee = new EmptyFilter().filter();
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
        testFixture('should return true for undefined, false, null', [undefined, false, null], true);
        testFixture('should return true for a empty String', '', true);
        testFixture('should return true for a empty Array', [], true);
        testFixture('should return true for a empty Map', new Map(), true);
        testFixture('should return true for a empty Object', {}, true);
        testFixture('should return false for everything else', [true, 'Hi', 0, 1, [1], { 'Hi': 42 }], false);
    });
});
