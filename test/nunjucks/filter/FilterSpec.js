'use strict';

/**
 * Requirements
 */
const Filter = require(ES_SOURCE + '/nunjucks/filter/Filter.js').Filter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(Filter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(Filter, 'nunjucks.filter/Filter');

    describe('#filter()', function() {
        it('should return a empty string', function() {
            const testee = new Filter().filter();
            expect(testee()).to.be.equal('');
        });
    });
});
