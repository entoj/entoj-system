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
        this._name = ['assetUrl', 'asset'];

        // Assign options
        this._baseUrl = baseUrl || '/';
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
     * @type {String}
     */
    get baseUrl()
    {
        if (this.environment &&
            this.environment.buildConfiguration)
        {
            return this.environment.buildConfiguration.get('filters.assetUrl', this._baseUrl);
        }
        return this._baseUrl;
    }


    /**
     * @inheritDoc
     */
    filter(value)
    {
        const scope = this;
        return function(value)
        {
            const result = urls.concat(scope.baseUrl, value);
            return scope.applyCallbacks(result, arguments, { asset: value });
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.AssetUrlFilter = AssetUrlFilter;
