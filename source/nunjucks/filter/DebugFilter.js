'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class DebugFilter extends Filter
{
    /**
     * @inheritDocs
     */
    constructor()
    {
        super();
        this._name = 'debug';
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'nunjucks.filter/DebugFilter';
    }


    /**
     * @inheritDocs
     */
    filter()
    {
        return function(value)
        {
            return '<pre>' + (typeof value) + ' :: ' + JSON.stringify(value) + '</pre>';
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DebugFilter = DebugFilter;
