'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const co = require('co');


/**
 * Applies NodeTransformer to a node.
 * Supports multiple passes.
 */
class Transformer extends Base
{
    /**
     * @param {Array} nodeTransformers
     */
    constructor(...nodeTransformers)
    {
        super();

        // Assign options
        this._nodeTransformers = [];
        for (const transformers of nodeTransformers)
        {
            if (!Array.isArray(transformers))
            {
                this._nodeTransformers.push([transformers]);
            }
            else
            {
                this._nodeTransformers.push(transformers);
            }
        }
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['transformer/Transformer.nodeTransformers'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'export/Transformer';
    }


    /**
     * @type {Array}
     */
    get nodeTransformers()
    {
        return this._nodeTransformers;
    }


    /**
     * Transforms a node.
     *
     * @param {export.ast.Node} node
     * @param {export.Configuration} configuration
     * @returns {Promise<String>}
     */
    transform(node, configuration)
    {
        const scope = this;
        const promise = co(function *()
        {
            let result = node;
            for (const pass of scope.nodeTransformers)
            {
                for (const nodeTransformer of pass)
                {
                    result = yield nodeTransformer.transform(result, configuration);
                }
            }
            return result;
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Transformer = Transformer;
