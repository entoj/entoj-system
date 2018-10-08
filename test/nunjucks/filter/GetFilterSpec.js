'use strict';

/**
 * Requirements
 */
const GetFilter = require(ES_SOURCE + '/nunjucks/filter/GetFilter.js').GetFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(GetFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(GetFilter, 'nunjucks.filter/GetFilter');

    /**
     * GetFilter Test
     */
    describe('#filter()', function() {
        it('should return undefined when key does not exist', function() {
            const testee = new GetFilter().filter();
            expect(testee()).to.be.undefined;
        });

        it('should return undefined when key does not exist', function() {
            const testee = new GetFilter().filter();
            expect(testee({ bar: 'foo' }, 'bar')).to.be.equal('foo');
        });
    });
});
