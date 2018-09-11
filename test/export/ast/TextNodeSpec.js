'use strict';

/**
 * Requirements
 */
const TextNode = require(ES_SOURCE + '/export/ast/TextNode.js').TextNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;

/**
 * Spec
 */
describe(TextNode.className, function() {
    /**
     * ValueNode Test
     */
    valueNodeSpec(TextNode, 'export.ast/TextNode');
});
