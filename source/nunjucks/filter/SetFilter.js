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
    constructor(globalConfiguration)
    {
        super();
        this._name = ['set', 'setProperty'];

        // Assign options
        this._globalConfiguration = globalConfiguration;
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
        return function(value, key, val)
        {
            const result = value || {};
            if (key)
            {
                result[key] = val;
            }
            return result;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SetFilter = SetFilter;
