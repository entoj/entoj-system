'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class SetFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = ['set', 'setProperty'];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/SetFilter';
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        const scope = this;
        return function(value, key, val)
        {
            const result = value || {};
            if (key)
            {
                result[key] = val;
            }
            return scope.applyCallbacks(result, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SetFilter = SetFilter;
