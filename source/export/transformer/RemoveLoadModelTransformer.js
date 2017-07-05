'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;


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
        // remove any set's to model references
        if (node.is('SetNode') &&
            node.variable.fields.length == 1 &&
            node.variable.fields[0] == 'model')
        {
            return Promise.resolve(false);
        }

        return Promise.resolve(node);
    }
}

module.exports.RemoveLoadModelTransformer = RemoveLoadModelTransformer;