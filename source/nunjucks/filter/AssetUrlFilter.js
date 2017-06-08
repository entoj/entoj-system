'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const urls = require('../../utils/urls.js');


/**
 * Generates a asset url.
 *
 * @memberOf nunjucks.filter
 */
class AssetUrlFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(baseUrl)
    {
        super();
        this._name = 'assetUrl';

        // Assign options
        this.baseUrl = baseUrl || '/';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/AssetUrlFilter.baseUrl'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/AssetUrlFilter';
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        const scope = this;
        return function(value)
        {
            return urls.concat(scope.baseUrl, value);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.AssetUrlFilter = AssetUrlFilter;
