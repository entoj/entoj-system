'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const AnyNodeRenderer = require(ES_SOURCE + '/export/renderer/AnyNodeRenderer.js').AnyNodeRenderer;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const exportHelper = require(ES_TEST + '/export/ExportHelper.js')();


/**
 * Shared NodeRenderer spec
 */
function spec(type, className, prepareParameters, options)
{
    /**
     * Base Test
     */
    const typeName = className.split('/').pop();
    baseSpec(type, className, prepareParameters);


    /**
     * NodeRenderer Test
     */
    beforeEach(function()
    {
        global.fixtures = (options && options.createFixture)
            ? options.createFixture()
            : projectFixture.createStatic({ skipEntities: true });
    });

    // Create testee
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };


    describe('#willRender', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.willRender()).to.be.instanceof(Promise);
        });
    });


    describe('#shouldStopRendering', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.shouldStopRendering()).to.be.instanceof(Promise);
        });
    });


    describe('#render', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.render()).to.be.instanceof(Promise);
        });

        if (typeName !== 'NodeRenderer')
        {
            it('should render to a string', function()
            {
                return spec.testFixture(typeName, createTestee());
            });
        }
    });
}


// Runs a simple testfixture
function testFixture(name, nodeRenderer)
{
    const nodeRenderers = [nodeRenderer, new AnyNodeRenderer()];
    return exportHelper.testRenderFixture(name, nodeRenderers);
}
spec.testFixture = testFixture;


/**
 * Exports
 */
module.exports.spec = spec;
