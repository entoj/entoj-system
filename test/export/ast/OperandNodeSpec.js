'use strict';

/**
 * Requirements
 */
const OperandNode = require(ES_SOURCE + '/export/ast/OperandNode.js').OperandNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;

/**
 * Spec
 */
describe(OperandNode.className, function() {
    /**
     * ValueNode Test
     */
    valueNodeSpec(OperandNode, 'export.ast/OperandNode');
});
