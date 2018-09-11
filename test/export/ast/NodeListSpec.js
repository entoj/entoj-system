'use strict';

/**
 * Requirements
 */
const NodeList = require(ES_SOURCE + '/export/ast/NodeList.js').NodeList;
const nodeListSpec = require('./NodeListShared.js').spec;

/**
 * Spec
 */
describe(NodeList.className, function() {
    /**
     * NodeList Test
     */
    nodeListSpec(NodeList, 'export.ast/NodeList', {
        serialized: {
            type: 'NodeList',
            children: []
        }
    });
});
