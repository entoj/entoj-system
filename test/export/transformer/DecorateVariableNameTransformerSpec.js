'use strict';

/**
 * Requirements
 */
const DecorateVariableNameTransformer = require(ES_SOURCE + '/export/transformer/DecorateVariableNameTransformer.js').DecorateVariableNameTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;


/**
 * Spec
 */
describe(DecorateVariableNameTransformer.className, function()
{
    /**
     * NodeTransformer Test
     */
    nodeTransformerSpec(DecorateVariableNameTransformer, 'export.transformer/DecorateVariableNameTransformer');


    /**
     * DecorateVariablesTransformer Test
     */
    describe('#transform()', function()
    {
        it('should decorate variables', function()
        {
            const testee = new DecorateVariableNameTransformer(
                {
                    prefix: 'pre_',
                    suffix: '_suf',
                    filter: (name) => name !== 'keep'
                });
            return nodeTransformerSpec.testFixture(testee);
        });
    });
});
