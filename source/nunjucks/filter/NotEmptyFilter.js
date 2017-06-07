'use strict';

/**
 * Requirements
 * @ignore
 */
const EmptyFilter = require('./EmptyFilter.js').EmptyFilter;


/**
 * The inverse of EmptyFilter
 *
 * @memberOf nunjucks.filter
 * @see nunjucks.filter.EmptyFilter
 */
class NotEmptyFilter extends EmptyFilter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = 'notempty';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/NotEmptyFilter';
    }


    /**
     * @param {*} value
     */
    filter(value)
    {
        const scope = this;
        return function(value)
        {
            return !scope.isEmpty(value);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.NotEmptyFilter = NotEmptyFilter;
