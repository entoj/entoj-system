'use strict';

/**
 * Requirements
 */
const CallNode = require(ES_SOURCE + '/export/ast/CallNode.js').CallNode;
const callableNodeSpec = require('./CallableNodeShared.js').spec;


/**
 * Spec
 */
describe(CallNode.className, function()
{
    /**
     * CallableNode Test
     */
    callableNodeSpec(CallNode, 'export.ast/CallNode');
});
