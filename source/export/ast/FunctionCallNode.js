'use strict';

/**
 * Requirements
 * @ignore
 */
const CallableNode = require('./CallableNode.js').CallableNode;

/**
 * A function call
 */
class FunctionCallNode extends CallableNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/FunctionCallNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.FunctionCallNode = FunctionCallNode;
