'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeTransformer = require('./NodeTransformer.js').NodeTransformer;


/**
 * Adds configurable prefix and suffix to VariableNodes. To specify only a
 * subset of all variables use a filter function via options.filter
 *
 * @todo rename to ModifyVariableNameTransformer
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
        this._mapping = opts.mapping || {};
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
     * @type {Object}
     */
    get mapping()
    {
        return this._mapping;
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
                const variableName = node.fields.join('.');
                this.logger.info('transformNode - decorating variable ' + variableName);

                // See if variable needs to be mapped
                if (this.mapping[variableName])
                {
                    node.fields = this.mapping[variableName].split('.');
                }

                // Add pre/suffix
                node.fields[0] = this.prefix + node.fields[0] + this.suffix;
            }
        }
        return Promise.resolve(node);
    }
}

module.exports.DecorateVariableNameTransformer = DecorateVariableNameTransformer;
