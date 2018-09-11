'use strict';

/**
 * Requirements
 */
const GroupNode = require(ES_SOURCE + '/export/ast/GroupNode.js').GroupNode;
const nodeListSpec = require('./NodeListShared.js').spec;

/**
 * Spec
 */
describe(GroupNode.className, function() {
    /**
     * NodeList Test
     */
    nodeListSpec(GroupNode, 'export.ast/GroupNode', {
        serialized: {
            type: 'GroupNode',
            children: []
        }
    });
});
