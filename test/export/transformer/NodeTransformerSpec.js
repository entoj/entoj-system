'use strict';

/**
 * Requirements
 */
const NodeTransformer = require(ES_SOURCE + '/export/transformer/NodeTransformer.js').NodeTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;


/**
 * Spec
 */
describe(NodeTransformer.className, function()
{
    nodeTransformerSpec(NodeTransformer, 'export.transformer/NodeTransformer');
});
