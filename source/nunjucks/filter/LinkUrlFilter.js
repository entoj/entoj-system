'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const isPlainObject = require('lodash.isplainobject');


/**
 * Generates a link url fro the given link object.
 * This serves as a integration helper for cms's
 *
 * @memberOf nunjucks.filter
 */
class LinkUrlFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor(dataProperties)
    {
        super();
        this._name = ['linkUrl', 'link'];

        // Assign options
        this.dataProperties = dataProperties || ['url'];
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/LinkUrlFilter.dataProperties'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/LinkUrlFilter';
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        const scope = this;
        return function(value)
        {
            if (typeof value === 'string')
            {
                return value;
            }
            if (isPlainObject(value))
            {
                for (const dataProperty of scope.dataProperties)
                {
                    if (typeof value[dataProperty] === 'string')
                    {
                        return value[dataProperty];
                    }
                }
            }
            return 'JavaScript:;';
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.LinkUrlFilter = LinkUrlFilter;
