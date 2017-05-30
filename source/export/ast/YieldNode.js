'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require('./Node.js').Node;


/**
 * Represents a placeholder for rendered subcontent (e.g. caller())
 */
class YieldNode extends Node
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.ast/YieldNode';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.YieldNode = YieldNode;
