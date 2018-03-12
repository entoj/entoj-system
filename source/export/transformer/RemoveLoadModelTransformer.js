'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;
const metrics = require('../../utils/performance.js').metrics;


/**
 * Removes any {% set var = model|load %} or set {% set model = whatever %} tags
 */
class RemoveLoadModelTransformer extends NodeTransformer
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'export.transformer/RemoveLoadModelTransformer';
    }


    /**
     * @inheritDocs
     */
    transformNode(node, transformer, options)
    {
        metrics.start(this.className + '::transformNode');

        // remove any set's that use the load filter
        if (node.is('SetNode') &&
            node.value.find('FilterNode', { name: 'load' }))
        {
            metrics.stop(this.className + '::transformNode');
            return Promise.resolve(false);
        }

        metrics.stop(this.className + '::transformNode');
        return Promise.resolve(node);
    }
}

module.exports.RemoveLoadModelTransformer = RemoveLoadModelTransformer;
