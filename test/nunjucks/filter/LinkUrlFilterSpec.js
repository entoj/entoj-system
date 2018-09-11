'use strict';

/**
 * Requirements
 */
const LinkUrlFilter = require(ES_SOURCE + '/nunjucks/filter/LinkUrlFilter.js').LinkUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(LinkUrlFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(LinkUrlFilter, 'nunjucks.filter/LinkUrlFilter');

    /**
     * LinkUrlFilter Test
     */
    describe('#filter()', function() {
        it('should return a "empty" link when no valid link given', function() {
            const testee = new LinkUrlFilter().filter();
            expect(testee()).to.be.equal('JavaScript:;');
            expect(testee(1)).to.be.equal('JavaScript:;');
            expect(testee(true)).to.be.equal('JavaScript:;');
            expect(testee({})).to.be.equal('JavaScript:;');
        });

        it('should return a link when given a string', function() {
            const testee = new LinkUrlFilter().filter();
            expect(testee('/hi/there')).to.be.equal('/hi/there');
        });

        it('should allow to configure properties to search for a link when given a object', function() {
            const testee = new LinkUrlFilter(['url']).filter();
            expect(testee({ url: '/hi/there' })).to.be.equal('/hi/there');
        });
    });
});
