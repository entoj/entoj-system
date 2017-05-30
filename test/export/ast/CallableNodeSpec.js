'use strict';

/**
 * Requirements
 */
const CallableNode = require(ES_SOURCE + '/export/ast/CallableNode.js').CallableNode;
const callableNodeSpec = require('./CallableNodeShared.js').spec;

/**
 * Spec
 */
describe(CallableNode.className, function()
{
    /**
     * CallableNode Test
     */
    callableNodeSpec(CallableNode, 'export.ast/CallableNode');
});
