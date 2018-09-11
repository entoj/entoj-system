'use strict';

/**
 * Requirements
 * @ignore
 */
const CallableNode = require('./CallableNode.js').CallableNode;

/**
 * A macro render call
 */
class CallNode extends CallableNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/CallNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.CallNode = CallNode;
