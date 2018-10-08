'use strict';

/**
 * Requirements
 */
const LipsumFilter = require(ES_SOURCE + '/nunjucks/filter/LipsumFilter.js').LipsumFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(LipsumFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(LipsumFilter, 'nunjucks.filter/LipsumFilter');

    /**
     * LipsumFilter Test
     */
    describe('#filter()', function() {
        it('should return a lipsum word', function() {
            const testee = new LipsumFilter().filter();
            expect(testee()).to.have.length.above(1);
        });

        it('should return a lipsum sentence when unit=s', function() {
            const testee = new LipsumFilter().filter();
            expect(testee(false, 's').split(' ')).to.have.length.above(5);
        });

        it('should return a lipsum paragraphs when unit=p', function() {
            const testee = new LipsumFilter().filter();
            expect(testee(false, 'p').split('\n')).to.have.length.above(1);
        });
    });
});
