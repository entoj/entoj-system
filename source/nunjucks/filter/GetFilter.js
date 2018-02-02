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
        this._name = ['get', 'getProperty'];
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
        const scope = this;
        return function(value, key)
        {
            let result = undefined;
            if (value && typeof key !== 'undefined')
            {
                result = value[key];
            }
            return scope.applyCallbacks(result, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.GetFilter = GetFilter;
