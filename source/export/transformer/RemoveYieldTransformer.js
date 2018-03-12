'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const NodeList = require('../ast/NodeList.js').NodeList;
const metrics = require('../../utils/PerformanceMetrics.js').metrics;


/**
 * Removes caller() and if caller constructs from the ast
 */
class RemoveYieldTransformer extends NodeTransformer
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'export.transformer/RemoveYieldTransformer';
    }


    /**
     * @inheritDocs
     */
    transformNode(node, transformer, options)
    {
        metrics.start(this.className + '::transformNode');

        // Remove if caller then ... else ...
        if (node.is('IfNode') &&
            node.condition.children.length &&
            node.condition.children[0].is('FilterNode') &&
            node.condition.children[0].name == 'notempty' &&
            node.condition.children[0].value &&
            node.condition.children[0].value.is('VariableNode') &&
            node.condition.children[0].value.fields.length === 1 &&
            node.condition.children[0].value.fields[0].startsWith('caller'))
        {
            metrics.stop(this.className + '::transformNode');
            return Promise.resolve(new NodeList({ children: node.elseChildren }));
        }

        // Remove caller()
        if (node.is('YieldNode'))
        {
            metrics.stop(this.className + '::transformNode');
            return Promise.resolve(false);
        }

        metrics.stop(this.className + '::transformNode');
        return Promise.resolve(node);
    }
}

module.exports.RemoveYieldTransformer = RemoveYieldTransformer;
