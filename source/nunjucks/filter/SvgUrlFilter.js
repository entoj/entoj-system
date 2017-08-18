'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const urls = require('../../utils/urls.js');


/**
 * Generates a svg spritesheet url.
 *
 * @memberOf nunjucks.filter
 */
class SvgUrlFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(baseUrl)
    {
        super();
        this._name = 'svgUrl';

        // Assign options
        this._baseUrl = baseUrl || '/';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/SvgUrlFilter.baseUrl'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/SvgUrlFilter';
    }


    /**
     * @type {String}
     */
    get baseUrl()
    {
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
            return urls.concat(scope.baseUrl, value + '.svg#icon');
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SvgUrlFilter = SvgUrlFilter;
