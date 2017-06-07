'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const isPlainObject = require('lodash.isplainobject');


/**
 * A value is empty when it's:
 *  - null
 *  - ''
 *  - a empty Array
 *  - a empty Map
 *  - {}
 *
 * @memberOf nunjucks.filter
 */
class EmptyFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();
        this._name = 'empty';
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/EmptyFilter';
    }


    /**
     * @protected
     * @param {*} value
     * @retuns {Boolean}
     */
    isEmpty(value)
    {
        if (Number.isFinite(value))
        {
            return false;
        }
        if (Array.isArray(value))
        {
            return value.length === 0;
        }
        if (value && value instanceof Map)
        {
            return value.size === 0;
        }
        if (isPlainObject(value))
        {
            return Object.keys(value).length === 0;
        }
        if (value === '' || value === null)
        {
            return true;
        }
        return !value;
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        const scope = this;
        return function(value)
        {
            return scope.isEmpty(value);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EmptyFilter = EmptyFilter;
