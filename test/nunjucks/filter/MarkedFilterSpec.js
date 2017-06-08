'use strict';

/**
 * Requirements
 */
const MarkdownFilter = require(ES_SOURCE + '/nunjucks/filter/MarkdownFilter.js').MarkdownFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(MarkdownFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(MarkdownFilter, 'nunjucks.filter/MarkdownFilter');


    /**
     * MarkdownFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a empty string when no markdown given', function()
        {
            const testee = new MarkdownFilter().filter();
            expect(testee()).to.be.equal('');
            expect(testee('')).to.be.equal('');
        });
    });
});
