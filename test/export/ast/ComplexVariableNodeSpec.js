'use strict';

/**
 * Requirements
 */
const ComplexVariableNode = require(ES_SOURCE + '/export/ast/ComplexVariableNode.js')
    .ComplexVariableNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;

/**
 * Spec
 */
describe(ComplexVariableNode.className, function() {
    /**
     * ValueNode Test
     */
    valueNodeSpec(ComplexVariableNode, 'export.ast/ComplexVariableNode');
});
