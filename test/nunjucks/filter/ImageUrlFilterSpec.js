'use strict';

/**
 * Requirements
 */
const ImageUrlFilter = require(ES_SOURCE + '/nunjucks/filter/ImageUrlFilter.js').ImageUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;


/**
 * Spec
 */
describe(ImageUrlFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(ImageUrlFilter, 'nunjucks.filter/ImageUrlFilter');


    /**
     * ImageUrlFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a untouched image when given a svg image', function()
        {
            const testee = new ImageUrlFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('boo.svg', '1x1', 100)).to.be.equal('/images/boo.svg');
        });

        it('should return a untouched image when given a image', function()
        {
            const testee = new ImageUrlFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('boo.jpg')).to.be.equal('/images/boo.jpg');
        });

        it('should return a resized image when given a aspect ration and width', function()
        {
            const testee = new ImageUrlFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('boo.jpg', '10x5', 500)).to.be.equal('/images/boo.jpg/500/250/1');
        });

        it('should return a resized image when given a width', function()
        {
            const testee = new ImageUrlFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('boo.jpg', 500)).to.be.equal('/images/boo.jpg/500/0/0');
        });

        it('should return a resized image when given a height', function()
        {
            const testee = new ImageUrlFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('boo.jpg', 0, 500)).to.be.equal('/images/boo.jpg/0/500/0');
        });

        it('should rallow to force the image into a size', function()
        {
            const testee = new ImageUrlFilter(global.fixtures.globalConfiguration).filter();
            expect(testee('boo.jpg', 250, 500, true)).to.be.equal('/images/boo.jpg/250/500/1');
        });
    });
});
