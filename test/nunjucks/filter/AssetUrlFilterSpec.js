'use strict';

/**
 * Requirements
 */
const AssetUrlFilter = require(ES_SOURCE + '/nunjucks/filter/AssetUrlFilter.js').AssetUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(AssetUrlFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(AssetUrlFilter, 'nunjucks.filter/AssetUrlFilter');


    /**
     * AssetUrlFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a url for a asset path', function()
        {
            const testee = new AssetUrlFilter().filter();
            expect(testee('boo.svg')).to.be.equal('/boo.svg');
            expect(testee('/base/assets/boo.svg')).to.be.equal('/base/assets/boo.svg');
        });

        it('should allow to cunfigure the base url', function()
        {
            const testee = new AssetUrlFilter('/base/assets').filter();
            expect(testee('boo.svg')).to.be.equal('/base/assets/boo.svg');
            expect(testee('/hotshit/boo.svg')).to.be.equal('/base/assets/hotshit/boo.svg');
        });
    });
});
