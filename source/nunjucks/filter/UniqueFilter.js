'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;

/**
 * Current uniqueId
 * @type {Number}
 */
let uniqueId = 0;


/**
 * @memberOf nunjucks.filter
 */
class UniqueFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor()
    {
        super();
        this._name = 'unique';
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/UniqueFilter';
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        return function(value, separator)
        {
            const sep = typeof separator === 'undefined' ? '-' : separator;
            uniqueId = (uniqueId + 1) % Number.MAX_SAFE_INTEGER;
            return String(value) + sep + uniqueId;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.UniqueFilter = UniqueFilter;
