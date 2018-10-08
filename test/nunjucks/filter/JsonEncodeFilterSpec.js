'use strict';

/**
 * Requirements
 */
const JsonEncodeFilter = require(ES_SOURCE + '/nunjucks/filter/JsonEncodeFilter.js')
    .JsonEncodeFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(JsonEncodeFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(JsonEncodeFilter, 'nunjucks.filter/JsonEncodeFilter');

    /**
     * JsonEncodeFilter Test
     */
    describe('#filter()', function() {
        it('should return undefined when no value given', function() {
            const testee = new JsonEncodeFilter().filter();
            expect(testee()).to.be.undefined;
        });

        it('should encode the given value', function() {
            const testee = new JsonEncodeFilter().filter();
            expect(testee({ hi: 'you' })).to.be.equal('{"hi":"you"}');
        });
    });
});
