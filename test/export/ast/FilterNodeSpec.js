'use strict';

/**
 * Requirements
 */
const FilterNode = require(ES_SOURCE + '/export/ast/FilterNode.js').FilterNode;
const callableNodeSpec = require('./CallableNodeShared.js').spec;
const valueNodeSpec = require('./ValueNodeShared.js').spec;


/**
 * Spec
 */
describe(FilterNode.className, function()
{
    const fixture =
    {
        serialized:
        {
            type: 'FilterNode',
            children: [],
            arguments: [],
            name: undefined,
            value: undefined
        }
    };

    /**
     * ValueNode Test
     */
    valueNodeSpec(FilterNode, 'export.ast/FilterNode', fixture);

    /**
     * CallableNode Test
     */
    callableNodeSpec(FilterNode, 'export.ast/FilterNode', fixture);
});
