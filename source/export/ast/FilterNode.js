'use strict';

/**
 * Requirements
 * @ignore
 */
const CallableNode = require('./CallableNode.js').CallableNode;
const ValueNodeMixin = require('./ValueNode.js').ValueNodeMixin;


/**
 * A view helper / filter node
 */
class FilterNode extends ValueNodeMixin(CallableNode)
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'export.ast/FilterNode';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.FilterNode = FilterNode;
