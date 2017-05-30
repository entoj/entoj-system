'use strict';

/**
 * Requirements
 */
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const nodeSpec = require('./NodeShared.js').spec;

/**
 * Spec
 */
describe(Node.className, function()
{
    /**
     * Node Test
     */
    nodeSpec(Node, 'export.ast/Node',
        {
            serialized:
            {
                type: 'Node'
            }
        });
});
