'use strict';

/**
 * Requirements
 */
const ConditionNode = require(ES_SOURCE + '/export/ast/ConditionNode.js').ConditionNode;
const nodeListSpec = require('./NodeListShared.js').spec;

/**
 * Spec
 */
describe(ConditionNode.className, function() {
    /**
     * NodeList Test
     */
    nodeListSpec(ConditionNode, 'export.ast/ConditionNode', {
        serialized: {
            type: 'ConditionNode',
            children: []
        }
    });
});
