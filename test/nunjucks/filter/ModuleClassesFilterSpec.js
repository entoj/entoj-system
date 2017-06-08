'use strict';

/**
 * Requirements
 */
const ModuleClassesFilter = require(ES_SOURCE + '/nunjucks/filter/ModuleClassesFilter.js').ModuleClassesFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(ModuleClassesFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(ModuleClassesFilter, 'nunjucks.filter/ModuleClassesFilter');


    /**
     * ModuleClassesFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a empty string if no moduleClass given', function()
        {
            const testee = new ModuleClassesFilter().filter();
            expect(testee()).to.be.equal('');
            expect(testee('large')).to.be.equal('');
        });

        it('should return the moduleClass when no types given', function()
        {
            const testee = new ModuleClassesFilter().filter();
            expect(testee(undefined, 'm-teaser')).to.be.equal('m-teaser');
        });

        it('should return the moduleClass and a modificator for a given type', function()
        {
            const testee = new ModuleClassesFilter().filter();
            expect(testee('default', 'm-teaser')).to.be.equal('m-teaser m-teaser--default');
        });

        it('should return the moduleClass and a modificator for any given type', function()
        {
            const testee = new ModuleClassesFilter().filter();
            expect(testee(['default', 'hero'], 'm-teaser')).to.be.equal('m-teaser m-teaser--default m-teaser--hero');
        });
    });
});
