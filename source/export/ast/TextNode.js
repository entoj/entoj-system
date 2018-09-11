'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueNode = require('./ValueNode.js').ValueNode;

/**
 * What is this?
 */
class TextNode extends ValueNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/TextNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TextNode = TextNode;
