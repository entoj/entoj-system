'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;


/**
 * Adds configurable prefix and suffix to VariableNodes. To specify only a
 * subset of all variables use a filter function via options.filter
 */
class DecorateVariableNameTransformer extends NodeTransformer
{
    /**
     * @ingnore
     */
    constructor(options)
    {
        super();

        // Assign options
        const opts = options || {};
        this._filter = opts.filter || false;
        this._prefix = opts.prefix || '';
        this._suffix = opts.suffix || '';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export.transformer/DecorateVariableNameTransformer';
    }


    /**
     * @type {Function}
     */
    get filter()
    {
        return this._filter;
    }


    /**
     * @type {String}
     */
    get prefix()
    {
        return this._prefix;
    }


    /**
     * @type {String}
     */
    get suffix()
    {
        return this._suffix;
    }


    /**
     * @inheritDocs
     */
    transformNode(node, configuration)
    {
        if (node.is('VariableNode'))
        {
            // See if variable is allowed
            if (!this.filter ||
                (this.filter && this.filter(node.fields[0])))
            {
                this.logger.info('transformNode - decorating variable ' + node.fields.join('.'));

                // Add pre/suffix
                node.fields[0] = this.prefix + node.fields[0] + this.suffix;
            }
        }
        return Promise.resolve(node);
    }
}

module.exports.DecorateVariableNameTransformer = DecorateVariableNameTransformer;
