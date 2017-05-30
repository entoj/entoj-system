'use strict';

/**
 * Requirements
 */
const BooleanOperandNode = require(ES_SOURCE + '/export/ast/BooleanOperandNode.js').BooleanOperandNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;

/**
 * Spec
 */
describe(BooleanOperandNode.className, function()
{
    /**
     * ValueNode Test
     */
    valueNodeSpec(BooleanOperandNode, 'export.ast/BooleanOperandNode');
});
