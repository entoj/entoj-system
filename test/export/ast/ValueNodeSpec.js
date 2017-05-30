'use strict';

/**
 * Requirements
 */
const ValueNode = require(ES_SOURCE + '/export/ast/ValueNode.js').ValueNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;


/**
 * Spec
 */
describe(ValueNode.className, function()
{
    /**
     * ValueNode Test
     */
    valueNodeSpec(ValueNode, 'export.ast/ValueNode');
});
