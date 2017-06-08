'use strict';

/**
 * Requirements
 */
const TranslateFilter = require(ES_SOURCE + '/nunjucks/filter/TranslateFilter.js').TranslateFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(TranslateFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(TranslateFilter, 'nunjucks.filter/TranslateFilter');


    /**
     * TranslateFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a empty string for a unknown translation keys', function()
        {
            const testee = new TranslateFilter().filter();
            expect(testee()).to.be.equal('');
            expect(testee(false, false)).to.deep.equal('');
        });

        it('should allow to translate based on the filter value', function()
        {
            const testee = new TranslateFilter({ foo: 'bar' }).filter();
            expect(testee('foo')).to.be.equal('bar');
        });

        it('should allow to translate based on the filter parameter', function()
        {
            const testee = new TranslateFilter({ foo: 'bar' }).filter();
            expect(testee(false, 'foo')).to.be.equal('bar');
        });

        it('should return the translation key when not found', function()
        {
            const testee = new TranslateFilter().filter();
            expect(testee('foo')).to.be.equal('foo');
        });

        it('should allow to use index based variables in translations', function()
        {
            const testee = new TranslateFilter({ foo: '{1}bar{0}' }).filter();
            expect(testee('foo', '-post', 'pre-')).to.be.equal('pre-bar-post');
        });
    });
});
