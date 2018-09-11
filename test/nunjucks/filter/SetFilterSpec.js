'use strict';

/**
 * Requirements
 */
const SetFilter = require(ES_SOURCE + '/nunjucks/filter/SetFilter.js').SetFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(SetFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(SetFilter, 'nunjucks.filter/SetFilter');

    /**
     * SetFilter Test
     */
    describe('#filter()', function() {
        it('should return a object', function() {
            const testee = new SetFilter().filter();
            expect(testee()).to.be.deep.equal({});
        });

        it('should set the given property to the given value', function() {
            const testee = new SetFilter().filter();
            expect(testee({ bar: 'foo' }, 'foo', 'bar')).to.be.deep.equal({
                bar: 'foo',
                foo: 'bar'
            });
            expect(testee(undefined, 'foo', 'bar')).to.be.deep.equal({ foo: 'bar' });
        });
    });
});
