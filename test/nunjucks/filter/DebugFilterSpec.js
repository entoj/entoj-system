'use strict';

/**
 * Requirements
 */
const DebugFilter = require(ES_SOURCE + '/nunjucks/filter/DebugFilter.js').DebugFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(DebugFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(DebugFilter, 'nunjucks.filter/DebugFilter');

    /**
     * DebugFilter Test
     */
    describe('#filter()', function() {
        it('should return a string describing the goven value', function() {
            const testee = new DebugFilter().filter();
            expect(testee()).to.be.equal('<pre>undefined :: undefined</pre>');
            expect(testee('Clark')).to.be.equal('<pre>string :: "Clark"</pre>');
        });
    });
});
