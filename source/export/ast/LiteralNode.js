'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueNode = require('./ValueNode.js').ValueNode;

/**
 * Represents a literal scalar value
 */
class LiteralNode extends ValueNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/LiteralNode';
    }

    /**
     * @type {String}
     */
    get valueType() {
        return typeof this.value;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LiteralNode = LiteralNode;
