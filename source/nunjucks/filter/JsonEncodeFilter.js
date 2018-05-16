'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class JsonEncodeFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = ['jsonEncode'];
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/JsonEncodeFilter';
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        const scope = this;
        return function(value)
        {
            return scope.applyCallbacks(JSON.stringify(value));
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.JsonEncodeFilter = JsonEncodeFilter;
