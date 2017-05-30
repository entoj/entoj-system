'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require('./NodeList.js').NodeList;


/**
 *
 */
class ExpressionNode extends NodeList
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/ExpressionNode';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ExpressionNode = ExpressionNode;
