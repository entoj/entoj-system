'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueNode = require('./ValueNode.js').ValueNode;


/**
 * A variable that consists of several sub nodes (e.g. a json)
 */
class ComplexVariableNode extends ValueNode
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/ComplexVariableNode';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ComplexVariableNode = ComplexVariableNode;
