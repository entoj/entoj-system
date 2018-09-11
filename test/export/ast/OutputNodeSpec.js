'use strict';

/**
 * Requirements
 */
const OutputNode = require(ES_SOURCE + '/export/ast/OutputNode.js').OutputNode;
const nodeListSpec = require('./NodeListShared.js').spec;

/**
 * Spec
 */
describe(OutputNode.className, function() {
    /**
     * NodeList Test
     */
    nodeListSpec(OutputNode, 'export.ast/OutputNode', {
        serialized: {
            type: 'OutputNode',
            children: []
        }
    });
});
