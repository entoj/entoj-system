'use strict';

/**
 * Requirements
 */
const LiteralNode = require(ES_SOURCE + '/export/ast/LiteralNode.js').LiteralNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(LiteralNode.className, function()
{
    /**
     * ValueNode Test
     */
    valueNodeSpec(LiteralNode, 'export.ast/LiteralNode');


    /**
     * LiteralNode Test
     */
    baseSpec.assertProperty(new LiteralNode(), ['valueType'], undefined, 'undefined');
});
