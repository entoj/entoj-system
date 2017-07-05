'use strict';

/**
 * Requirements
 */
const RemoveLoadModelTransformer = require(ES_SOURCE + '/export/transformer/RemoveLoadModelTransformer.js').RemoveLoadModelTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;


/**
 * Spec
 */
describe(RemoveLoadModelTransformer.className, function()
{
    /**
     * NodeTransformer Test
     */
    nodeTransformerSpec(RemoveLoadModelTransformer, 'export.transformer/RemoveLoadModelTransformer');


    /**
     * RemoveLoadModelTransformer Test
     */
    describe('#transform()', function()
    {
        it('should remove model|load', function()
        {
            const testee = new RemoveLoadModelTransformer();
            return nodeTransformerSpec.testFixture(testee);
        });
    });
});
