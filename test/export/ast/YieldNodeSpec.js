'use strict';

/**
 * Requirements
 */
const YieldNode = require(ES_SOURCE + '/export/ast/YieldNode.js').YieldNode;
const nodeSpec = require('./NodeShared.js').spec;

/**
 * Spec
 */
describe(YieldNode.className, function()
{
    /**
     * Node Test
     */
    nodeSpec(YieldNode, 'export.ast/YieldNode',
        {
            serialized:
            {
                type: 'YieldNode'
            }
        });
});
