'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class GetFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = ['get'];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/GetFilter';
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        return function(value, key)
        {
            if (value && typeof key !== 'undefined')
            {
                return value[key];
            }
            return undefined;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.GetFilter = GetFilter;
