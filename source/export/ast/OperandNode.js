'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueNode = require('./ValueNode.js').ValueNode;

/**
 *
 */
class OperandNode extends ValueNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/OperandNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.OperandNode = OperandNode;
