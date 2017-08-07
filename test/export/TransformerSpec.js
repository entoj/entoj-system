'use strict';

/**
 * Requirements
 */
const Transformer = require(ES_SOURCE + '/export/Transformer.js').Transformer;
const NodeTransformer = require(ES_SOURCE + '/export/transformer/NodeTransformer.js').NodeTransformer;
const NodeList = require(ES_SOURCE + '/export/ast/NodeList.js').NodeList;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const sinon = require('sinon');
const co = require('co');


/**
 * Spec
 */
describe(Transformer.className, function()
{
    /**
     * Base Test
     */
    baseSpec(Transformer, 'export/Transformer');


    /**
     * Transformer Test
     */

    // Create a initialized testee
    const createTestee = function(nodeTransformers)
    {
        return new Transformer(nodeTransformers);
    };


    describe('#constructor', function()
    {
        it('should allow to configure a single pass transformation', function()
        {
            const testee = createTestee([new NodeTransformer()]);
            expect(testee.nodeTransformers).to.have.length(1);
            expect(testee.nodeTransformers[0]).to.have.length(1);
            expect(testee.nodeTransformers[0][0]).to.be.instanceof(NodeTransformer);
        });

        it('should allow to configure a multi pass transformation', function()
        {
            const testee = createTestee([[new NodeTransformer()], [new NodeTransformer()]]);
            expect(testee.nodeTransformers).to.have.length(2);
            expect(testee.nodeTransformers[0]).to.have.length(1);
            expect(testee.nodeTransformers[0][0]).to.be.instanceof(NodeTransformer);
            expect(testee.nodeTransformers[1]).to.have.length(1);
            expect(testee.nodeTransformers[1][0]).to.be.instanceof(NodeTransformer);
        });
    });


    describe('#transform', function()
    {
        it('should apply all node transformers', function()
        {
            const promise = co(function*()
            {
                const nodeTransformer1 = new NodeTransformer();
                const nodeTransformer2 = new NodeTransformer();
                const nodeTransformer3 = new NodeTransformer();
                const testee = createTestee([[nodeTransformer1, nodeTransformer2], [nodeTransformer3]]);
                sinon.spy(nodeTransformer1, 'transform');
                sinon.spy(nodeTransformer2, 'transform');
                sinon.spy(nodeTransformer3, 'transform');
                yield testee.transform(new NodeList());
                expect(nodeTransformer1.transform.calledOnce).to.be.ok;
                expect(nodeTransformer2.transform.calledOnce).to.be.ok;
                expect(nodeTransformer3.transform.calledOnce).to.be.ok;
            });
            return promise;
        });
    });
});
