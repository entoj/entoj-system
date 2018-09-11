'use strict';

/**
 * Requirements
 * @ignore
 */
const ParameterNode = require('./ParameterNode.js').ParameterNode;

/**
 * A single argument of a ArgumentsNode
 */
class ArgumentNode extends ParameterNode {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'export.ast/ArgumentNode';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ArgumentNode = ArgumentNode;
