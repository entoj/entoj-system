'use strict';

/**
 * Requirements
 */
const MarkupFilter = require(ES_SOURCE + '/nunjucks/filter/MarkupFilter.js').MarkupFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(MarkupFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(MarkupFilter, 'nunjucks.filter/MarkupFilter');

    /**
     * MarkupFilter Test
     */
    describe('#filter()', function() {
        it('should return a empty string when no value given', function() {
            const testee = new MarkupFilter().filter();
            expect(testee()).to.be.equal('');
            expect(testee('')).to.be.equal('');
        });

        it('should strip tags when type is plain', function() {
            const testee = new MarkupFilter().filter();
            expect(testee('<p>Hi</p>', 'plain')).to.be.equal('Hi');
        });

        it('should add tags when type is html or empty', function() {
            const testee = new MarkupFilter().filter();
            expect(testee('Hi')).to.be.equal('<p>Hi</p>\n');
            expect(testee('Hi', 'html')).to.be.equal('<p>Hi</p>\n');
        });

        it('should leaves as is if tags present when type is html or empty', function() {
            const testee = new MarkupFilter().filter();
            expect(testee('<h1>Hi</h1>')).to.be.equal('<h1>Hi</h1>');
        });
    });
});
