'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class HyphenateFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();
        this._name = 'hyphenate';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/HyphenateFilter';
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        return function (value)
        {
            return value;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.HyphenateFilter = HyphenateFilter;
