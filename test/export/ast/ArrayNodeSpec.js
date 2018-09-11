'use strict';

/**
 * Requirements
 */
const ArrayNode = require(ES_SOURCE + '/export/ast/ArrayNode.js').ArrayNode;
const nodeListSpec = require('./NodeListShared.js').spec;

/**
 * Spec
 */
describe(ArrayNode.className, function() {
    /**
     * NodeList Test
     */
    nodeListSpec(ArrayNode, 'export.ast/ArrayNode', {
        serialized: {
            type: 'ArrayNode',
            children: []
        }
    });
});
