'use strict';

/**
 * Requirements
 */
const ExpressionNode = require(ES_SOURCE + '/export/ast/ExpressionNode.js').ExpressionNode;
const nodeListSpec = require('./NodeListShared.js').spec;

/**
 * Spec
 */
describe(ExpressionNode.className, function() {
    /**
     * NodeList Test
     */
    nodeListSpec(ExpressionNode, 'export.ast/ExpressionNode', {
        serialized: {
            type: 'ExpressionNode',
            children: []
        }
    });
});
