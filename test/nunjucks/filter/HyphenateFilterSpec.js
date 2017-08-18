'use strict';

/**
 * Requirements
 */
const HyphenateFilter = require(ES_SOURCE + '/nunjucks/filter/HyphenateFilter.js').HyphenateFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(HyphenateFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(HyphenateFilter, 'nunjucks.filter/HyphenateFilter');


    /**
     * HyphenateFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a empty string when no text given', function()
        {
            const testee = new HyphenateFilter().filter();
            expect(testee()).to.be.equal('');
            expect(testee('')).to.be.equal('');
        });

        it('should return a hyphenated string', function()
        {
            const testee = new HyphenateFilter().filter();
            expect(testee('Das ist die Donaudampfschiffahrtsgesellschaft')).to.be.equal('Das ist die Do­nau­dampf­schif­fahrts­ge­sell­schaft');
        });
    });
});
